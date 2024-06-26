import { Effect, Stream } from 'effect';

import { convertToCoreMatch } from './convert-to-core-match/convert-to-core-match';
import { karmineCorpLeagues } from './karmine-corp-leagues';
import { paginateKarmineCorpMatches } from './paginate-karmine-corp-matches';

export function getLeagueOfLegendsSchedule() {
  return Stream.Do.pipe(
    Stream.flatMap(() =>
      Stream.mergeAll(karmineCorpLeagues.map(paginateKarmineCorpMatches), {
        concurrency: 3,
      })
    ),
    Stream.mapEffect(
      (match) =>
        Effect.catchAll(convertToCoreMatch(match).pipe(Effect.map(Stream.succeed)), () =>
          Effect.succeed(Stream.empty)
        ),
      {
        concurrency: 3,
      }
    ),
    (_) => Stream.flatten(_)
  );
}
