import { Effect, Option } from 'effect';
import parseHtml, { HTMLElement } from 'node-html-parser';

import { getGameDetails } from './get-game-details';
import { getTeamName } from '../get-teams/get-teams';

import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';
import { VlrGgApiService } from '~/lib/karmine-corp-api/infrastructure/services/vlr-gg-api/vlr-gg-api-service';

export function getMatchDetails(matchElement: HTMLElement) {
  return Effect.all(
    {
      competitionName: getCompetitonName(matchElement),
      games: getGames(matchElement),
      bo: getBo(matchElement),
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

function getBo(matchElement: HTMLElement) {
  return Effect.Do.pipe(
    Effect.flatMap(() => getMatchPage(matchElement)),
    Effect.map((page) => page.querySelectorAll('.match-header-vs-score .match-header-vs-note')),
    Effect.flatMap((matchNotes) =>
      Option.firstSomeOf(
        matchNotes.map((note) =>
          Option.some(note.text.trim().toLowerCase()).pipe(
            Option.filter((text) => text.startsWith('bo'))
          )
        )
      )
    ),
    Effect.map((bo) => Number(bo.replace('bo', '')))
  );
}

function getPlayers(matchElement: HTMLElement) {
  return Effect.Do.pipe(
    Effect.flatMap(() => getMatchPage(matchElement)),
    Effect.map((page) => page.querySelectorAll('.vm-stats-game:first-of-type .mod-player')),
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

function getPlayerDetails(playerElement: HTMLElement) {
  return Effect.all(
    {
      name: Option.fromNullable(playerElement.querySelector('a div:first-of-type')?.text.trim()),
      imageUrl: getPlayerImageUrl(playerElement),
    },
    {
      concurrency: 1,
    }
  );
}

function getPlayerImageUrl(playerElement: HTMLElement) {
  return Effect.Do.pipe(
    Effect.flatMap(() => getPlayerPage(playerElement)),
    Effect.map((page) => page.querySelector('.player-header img')),
    Effect.flatMap((img) => Option.fromNullable(img?.getAttribute('src'))),
    Effect.map((src) => src.replace(/^\/\//, 'https://')),
    Effect.map((src) => src.replace(/^\//, 'https://www.vlr.gg/'))
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
    ),
    Effect.map((response) => parseHtml(response.html))
  );
}

const playersPagesCache = new Map<string, HTMLElement>();
function getPlayerPage(playerElement: HTMLElement) {
  return Effect.Do.pipe(
    Effect.flatMap(() =>
      Option.fromNullable(playerElement.querySelector('a')?.getAttribute('href'))
    ),
    Effect.map((href) => href.replace(/^\/?player\/?/, '')),
    Effect.flatMap((href) => Option.fromNullable(href.split('/')[0])),
    Effect.flatMap((playerId) =>
      Effect.Do.pipe(
        Effect.flatMap(() =>
          Option.Do.pipe(
            Option.flatMap(() => Option.fromNullable(playersPagesCache.get(playerId))),
            Option.map(Effect.succeed),
            Option.getOrElse(() =>
              Effect.Do.pipe(
                Effect.flatMap(() =>
                  Effect.serviceMembers(VlrGgApiService).functions.getPlayer({
                    playerId,
                  })
                ),
                Effect.map((response) => parseHtml(response.html))
              )
            )
          )
        ),
        Effect.tap((page) => playersPagesCache.set(playerId, page))
      )
    )
  );
}
