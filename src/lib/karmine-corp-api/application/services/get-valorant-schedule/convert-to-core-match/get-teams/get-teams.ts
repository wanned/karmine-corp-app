import { Effect, Option, Data } from 'effect';
import { HTMLElement } from 'node-html-parser';

import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';

export function getTeams(matchElement: HTMLElement) {
  return Effect.all([getTeam(matchElement, 0), getTeam(matchElement, 1)]) satisfies Effect.Effect<
    CoreData.ValorantMatch['teams'],
    any,
    any
  >;
}

function getTeam(matchElement: HTMLElement, teamIndex: 0 | 1) {
  return Effect.all({
    name: getTeamName(matchElement, teamIndex),
    logoUrl: getTeamLogoUrl(matchElement, teamIndex),
    score: Effect.catchTags(
      Effect.all({
        score: getTeamScore(matchElement, teamIndex),
        scoreType: Effect.succeed('gameWins' as const),
        isWinner: getTeamIsWinner(matchElement, teamIndex),
      }),
      {
        NoSuchElementException: () => Effect.succeed(undefined),
        NotAScoreError: () => Effect.succeed(undefined),
      }
    ),
  }) satisfies Effect.Effect<CoreData.ValorantMatch['teams'][number], any, any>;
}

export function getTeamName(matchElement: HTMLElement, teamIndex: 0 | 1) {
  return Option.fromNullable(
    matchElement
      .querySelector(`.m-item-team${teamIndex === 1 ? '.mod-right' : ''} .m-item-team-name`)
      ?.text.trim()
  );
}

export function getTeamLogoUrl(matchElement: HTMLElement, teamIndex: 0 | 1) {
  return Option.fromNullable(
    matchElement
      .querySelector(`.m-item-logo${teamIndex === 1 ? '.mod-right' : ''} img`)
      ?.getAttribute('src')
  ).pipe(
    Option.map((src) => src.replace(/^\/\//, 'https://')),
    Option.map((src) => src.replace(/^\//, 'https://www.vlr.gg/'))
  );
}

class NotAScoreError extends Data.TaggedError('NotAScoreError') {}
function getTeamScore(matchElement: HTMLElement, teamIndex: 0 | 1) {
  return Effect.Do.pipe(
    Effect.map(() => matchElement.querySelector('.m-item-result')?.text),
    Effect.flatMap((_) => Option.fromNullable(_)),
    Effect.map((result) => result.split(':').map((r) => parseInt(r.trim(), 10))),
    Effect.flatMap((splitResult) =>
      (
        splitResult.length === 1 // If there is only one part, it means it is the eta, not the score
      ) ?
        Effect.fail(new NotAScoreError())
      : Effect.succeed(splitResult)
    ),
    Effect.map((results) => results[teamIndex])
  );
}

function getTeamIsWinner(matchElement: HTMLElement, teamIndex: 0 | 1) {
  return Effect.Do.pipe(
    Effect.map(() => matchElement.querySelector('.m-item-result.mod-win')),
    Option.fromNullable,
    Option.match({
      onSome: () => Effect.succeed(teamIndex === 0),
      onNone: () => Effect.succeed(teamIndex === 1),
    })
  );
}
