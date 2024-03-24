import { Chunk, Effect, Option, Order } from 'effect';
import parseHtml from 'node-html-parser';

import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';
import { LiquipediaApiService } from '~/lib/karmine-corp-api/infrastructure/services/liquipedia-parse-api/liquipedia-parse-api-service';

class LeaderboardNotFoundError extends Error {
  constructor() {
    super('Leaderboard not found');
    this.name = 'LeaderboardNotFoundError';
  }
}

export const getRocketLeagueLeaderboard = () =>
  Effect.Do.pipe(
    Effect.flatMap(() => getCurrentSeason()),
    Effect.flatMap((currentSeason) =>
      Option.match(currentSeason, {
        onSome: (season) => getLeaderboardForSeason(season),
        onNone: () => Effect.fail(new LeaderboardNotFoundError()),
      })
    )
  );

const getCurrentSeason = () =>
  Effect.Do.pipe(
    Effect.flatMap(() =>
      Effect.serviceFunctionEffect(
        LiquipediaApiService,
        (_) => _.parse
      )({
        page: 'Rocket_League_Championship_Series',
        game: 'rocketleague',
      })
    ),
    Effect.map((data) =>
      Chunk.fromIterable(data.parse.links).pipe(
        Chunk.filter(
          (link) =>
            /^Rocket League Championship Series\/((Season.*)|(2\d\d\d))/.test(link['*']) &&
            link['*'].split('/').length === 2
        ),
        Chunk.map((link) => link['*'].split('/')[1]),
        Chunk.map((season) => {
          const seasonNumber = season.match(/Season (\d+|X)/)?.[1];

          if (seasonNumber === null || seasonNumber === undefined) {
            return Number(season.split('-')[0]);
          }

          return Number(seasonNumber.replace('X', '10'));
        }),
        Chunk.sort(Order.number),
        Chunk.last
      )
    )
  );

const getLeaderboardForSeason = (season: number) =>
  Effect.Do.pipe(
    Effect.flatMap(() =>
      Effect.serviceFunctionEffect(
        LiquipediaApiService,
        (_) => _.parse
      )({
        page: `Rocket_League_Championship_Series/${season}/Rankings`,
        game: 'rocketleague',
      })
    ),
    Effect.map((data) => {
      const html = parseHtml(data.parse.text['*']);

      const karmineCorpLeaderboardRow = html
        .querySelectorAll('.wikitable tr:has(a[title="Karmine Corp"])')
        .at(-1);

      if (!karmineCorpLeaderboardRow) return { [CoreData.CompetitionName.RocketLeague]: [] };

      const leaderboard: CoreData.Leaderboards[CoreData.CompetitionName.RocketLeague] = [];

      const numberOfTeams = karmineCorpLeaderboardRow.parentNode.querySelectorAll(
        `tr[data-toggle-area-content='${karmineCorpLeaderboardRow.getAttribute(
          'data-toggle-area-content'
        )}']`
      ).length;

      karmineCorpLeaderboardRow.parentNode
        .querySelectorAll('> *')
        .slice(-numberOfTeams)
        .forEach((el) => {
          if (el.classNames.includes('header')) return;

          const data = el.querySelectorAll('td');

          const rank = Number(data.at(0)?.text);
          if (isNaN(rank)) return;

          const points = Number(data.at(-1)?.text);
          if (isNaN(points)) return;

          const teamElement = el.querySelector('.team-template-image-icon img');
          const teamName = teamElement?.attributes.alt;
          let teamLogo = teamElement?.attributes.src;

          if (!teamName || !teamLogo) return;

          if (teamLogo.startsWith('/')) {
            teamLogo = `https://liquipedia.net${teamLogo}`;
          }

          leaderboard.push({
            teamName,
            teamId: teamName,
            logoUrl: teamLogo,
            position: rank,
            points,
          });
        });

      leaderboard.sort((a, b) => a.position - b.position);

      return { [CoreData.CompetitionName.RocketLeague]: leaderboard };
    })
  );
