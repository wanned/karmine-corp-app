import { Effect, Stream } from 'effect';

import { convertToCoreMatch } from './convert-to-core-match/convert-to-core-match';
import { getMatchId } from './convert-to-core-match/utils/get-match-id';
import { paginateKarmineCorpMatches } from './paginate-karmine-corp-matches';
import { GetScheduleParamsState } from '../../use-cases/get-schedule/get-schedule-params-state';

export function getListedMatches(matchesStream: ReturnType<typeof paginateKarmineCorpMatches>) {
  return Stream.Do.pipe(
    () => matchesStream,
    Stream.filterEffect((match) =>
      Effect.gen(function* (_) {
        // Filter by date
        const dateRange = yield* _(Effect.serviceConstants(GetScheduleParamsState).dateRange);
        if (dateRange !== undefined) {
          const date = new Date(match.date);
          if (
            (dateRange.start !== undefined && date < dateRange.start) ||
            (dateRange.end !== undefined && date > dateRange.end)
          ) {
            return false;
          }
        }

        // Filter by ignoreIds
        const ignoreIds = yield* _(Effect.serviceConstants(GetScheduleParamsState).ignoreIds);
        if (ignoreIds !== undefined) {
          const matchId = yield* _(getMatchId(match));
          return !ignoreIds.includes(matchId);
        }

        return true;
      })
    ),
    Stream.mapEffect(convertToCoreMatch)
  );
}
