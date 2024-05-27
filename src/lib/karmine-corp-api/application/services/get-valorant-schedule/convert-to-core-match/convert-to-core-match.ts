import { Effect, Option } from 'effect';
import { HTMLElement } from 'node-html-parser';

import { getMatchDetails } from './get-match-details/get-match-details';
import { getTeams } from './get-teams/get-teams';
import { getMatchDate as _getMatchDate } from './utils/get-match-date';
import { getMatchId } from './utils/get-match-id';
import { CoreData } from '../../../types/core-data';

export function convertToCoreMatch(matchContainerElement: HTMLElement) {
  return Effect.Do.pipe(
    Effect.flatMap(() =>
      Effect.all({
        id: getMatchId(matchContainerElement),
        teams: getTeams(matchContainerElement),
        date: getMatchDate(matchContainerElement),
        streamLink: Effect.succeed('kamet0'), // TODO
        status: getMatchStatus(matchContainerElement),
      })
    ),
    Effect.bind('matchDetails', ({ status, teams }) =>
      getMatchDetails({
        matchElement: matchContainerElement,
        status,
        teams,
      })
    )
  ) satisfies Effect.Effect<CoreData.ValorantMatch, any, any>;
}

function getMatchDate(matchElement: HTMLElement) {
  return Effect.Do.pipe(
    Effect.map(() => _getMatchDate(matchElement)),
    Effect.flatMap((_) => Option.fromNullable(_))
  );
}

function getMatchStatus(matchElement: HTMLElement) {
  return Option.Do.pipe(
    Option.flatMap(() =>
      Option.map(
        Option.fromNullable(matchElement.querySelector('.m-item-result.mod-live')),
        () => 'live' as const
      )
    ),
    Option.match({
      onSome: (status) => Option.some(status),
      onNone: () =>
        Option.map(
          Option.fromNullable(matchElement.querySelector('.m-item-result.mod-tbd')),
          () => 'upcoming' as const
        ),
    }),
    Option.getOrElse(() => 'finished' as const),
    Effect.succeed
  );
}
