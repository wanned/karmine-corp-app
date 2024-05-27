import { Effect, Option } from 'effect';
import { HTMLElement } from 'node-html-parser';

import { getGameDetails } from './get-game-details';
import { getTeamName } from '../get-teams/get-teams';

import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';
import { VlrGgApiService } from '~/lib/karmine-corp-api/infrastructure/services/vlr-gg-api/vlr-gg-api-service';

export function getMatchDetails({
  matchElement,
  status,
  teams,
}: {
  matchElement: HTMLElement;
  status: CoreData.Match['status'];
  teams: CoreData.ValorantMatch['teams'];
}) {
  return Effect.all(
    {
      competitionName: getCompetitonName(matchElement),
      games: getGames(matchElement),
      bo: getBo({ matchElement, status, teams }),
      players: getPlayers(matchElement),
    },
    {
      concurrency: 1,
    }
  ) satisfies Effect.Effect<CoreData.ValorantMatch['matchDetails'], any, any>;
}

function getCompetitonName(matchElement: HTMLElement) {
  return Option.firstSomeOf([getTeamName(matchElement, 0), getTeamName(matchElement, 1)]).pipe(
    Option.map((name) => name.toLowerCase()),
    Option.map((name) => name.includes('gc')),
    Option.map((isGC) =>
      isGC ? CoreData.CompetitionName.ValorantVCTGC : CoreData.CompetitionName.ValorantVCT
    )
  );
}

function getGames(matchElement: HTMLElement) {
  return Effect.Do.pipe(
    Effect.map(() => matchElement.querySelectorAll('.m-item-games > .m-item-games-item')),
    Effect.flatMap(Effect.forEach(getGameDetails))
  ) satisfies Effect.Effect<CoreData.ValorantGame[], any, any>;
}

function getBo({
  matchElement,
  status,
  teams,
}: {
  matchElement: HTMLElement;
  status: CoreData.Match['status'];
  teams: CoreData.ValorantMatch['teams'];
}) {
  if (status === 'finished') {
    const winningScore = teams.find((team) => team?.score?.isWinner)?.score?.score;
    if (winningScore !== undefined) {
      return Effect.succeed(winningScore + 1);
    }
  }

  return Effect.Do.pipe(
    Effect.flatMap(() => getMatchPage(matchElement)),
    Effect.map((page) => (typeof page.data.content === 'string' && page.data.content) || undefined),
    Effect.flatMap(Option.fromNullable),
    Effect.map((content) => content.toLowerCase().match(/\nbo(\d+)/)),
    Effect.flatMap(Option.fromNullable),
    Effect.map(([, bo]) => Number(bo))
  );
}

function getPlayers(matchElement: HTMLElement) {
  return Effect.Do.pipe(
    Effect.flatMap(() => getMatchPage(matchElement)),
    Effect.map((page) => (Array.isArray(page.data.links) ? page.data.links : [])),
    Effect.map((links) =>
      links.reduce<Set<string>>((acc, link) => {
        if (link.href && link.href.startsWith('/player/')) {
          acc.add(link.href);
        }
        return acc;
      }, new Set<string>())
    ),
    Effect.map((links) => [...links]),
    Effect.flatMap((players) =>
      Effect.all(
        {
          home: Effect.forEach(players.slice(0, 5), getPlayerDetails),
          away: Effect.forEach(players.slice(5), getPlayerDetails),
        },
        {
          concurrency: 1,
        }
      )
    )
  );
}

function getPlayerDetails(playerUrl: string) {
  return Effect.Do.pipe(
    Effect.map(() => playerUrl.match(/\/player\/(\d+)\/.+/)),
    Effect.flatMap(Option.fromNullable),
    Effect.map(([_, playerId]) => playerId),
    Effect.flatMap((playerId) =>
      Effect.serviceMembers(VlrGgApiService).functions.getPlayer({
        playerId,
      })
    ),
    Effect.map((player) => ({
      name: player.data.info.user,
      imageUrl: player.data.info.img,
    }))
  );
}

function getMatchPage(matchElement: HTMLElement) {
  return Effect.Do.pipe(
    Effect.map(() => matchElement.querySelector('a.m-item')),
    Effect.flatMap(Option.fromNullable),
    Effect.flatMap((matchLink) => Option.fromNullable(matchLink.getAttribute('href'))),
    Effect.map((href) => (href.startsWith('/') ? href.slice(1) : href)),
    Effect.flatMap((href) => Option.fromNullable(href.split('/')[0])),
    Effect.flatMap((gameId) =>
      Effect.serviceMembers(VlrGgApiService).functions.getMatch({
        gameId,
      })
    )
  );
}
