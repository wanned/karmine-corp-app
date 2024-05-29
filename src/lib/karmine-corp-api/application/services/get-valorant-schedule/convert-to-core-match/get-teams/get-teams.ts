import { Effect, Option, Data } from 'effect';
import { HTMLElement } from 'node-html-parser';

import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';

export function getTeams(matchElement: HTMLElement) {
  // Karmine Corp team will always be the first team in matchElement, but not on the match page.
  // That's the match page that matters for us, so we have to parse the match page url to get the Karmine Corp index.

  return Effect.Do.pipe(
    Effect.flatMap(() =>
      Effect.if(
        matchElement
          .querySelector('a')
          ?.attributes['href'].replaceAll('-', ' ')
          .split(' vs ')[0]
          .includes('karmine') === true,
        {
          onTrue: () => Effect.succeed(0 as const),
          onFalse: () => Effect.succeed(1 as const),
        }
      )
    ),
    Effect.flatMap((karmineCorpIndex) =>
      Effect.all(
        [
          getTeam(matchElement, karmineCorpIndex === 0 ? 0 : 1),
          getTeam(matchElement, karmineCorpIndex === 0 ? 1 : 0),
        ],
        {
          concurrency: 1,
        }
      )
    )
  ) satisfies Effect.Effect<CoreData.ValorantMatch['teams'], any, any>;
}

function getTeam(matchElement: HTMLElement, teamIndex: 0 | 1) {
  return Effect.all(
    {
      name: getTeamName(matchElement, teamIndex),
      logoUrl: getTeamLogoUrl(matchElement, teamIndex),
      score: Effect.catchTags(
        Effect.all(
          {
            score: getTeamScore(matchElement, teamIndex),
            scoreType: Effect.succeed('gameWins' as const),
            isWinner: getTeamIsWinner(matchElement, teamIndex),
          },
          {
            concurrency: 1,
          }
        ),
        {
          NoSuchElementException: () => Effect.succeed(undefined),
          NotAScoreError: () => Effect.succeed(undefined),
        }
      ),
    },
    {
      concurrency: 1,
    }
  ) satisfies Effect.Effect<CoreData.ValorantMatch['teams'][number], any, any>;
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
    Effect.map(Option.fromNullable),
    Effect.flatMap(
      Option.match({
        onSome: () => Effect.succeed(teamIndex === 0),
        onNone: () => Effect.succeed(teamIndex === 1),
      })
    )
  );
}
