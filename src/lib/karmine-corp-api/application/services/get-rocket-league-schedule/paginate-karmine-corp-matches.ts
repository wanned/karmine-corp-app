import { Chunk, Effect, Stream, Option } from 'effect';

import { getMatchId } from './convert-to-core-match/utils/get-match-id';
import { PaginateChunkEffectPaginatorFormatter } from '../../types/effect-utils';
import { GetScheduleParamsState } from '../../use-cases/get-schedule/get-schedule-params-state';

import { OctaneApi } from '~/lib/karmine-corp-api/infrastructure/services/octane-api/octane-api';
import { OctaneApiService } from '~/lib/karmine-corp-api/infrastructure/services/octane-api/octane-api-service';

type RocketLeagueMatch = OctaneApi.GetMatches['matches'][number];

const KARMINE_CORP_OCTANE_TEAM_ID = '60fbc5b887f814e9fbffdcbd';

export function paginateKarmineCorpMatches() {
  return Stream.paginateChunkEffect(undefined as OctaneApi.GetMatches | undefined, (lastResponse) =>
    Effect.scoped(getNextMatchesGetter()(lastResponse))
  );
}

function getNextMatchesGetter() {
  return function getNextMatches(lastResponse: OctaneApi.GetMatches | undefined) {
    return Effect.Do.pipe(
      Effect.flatMap(() =>
        Effect.serviceMembers(OctaneApiService).functions.getMatches({
          teamId: KARMINE_CORP_OCTANE_TEAM_ID,
          page: lastResponse ? lastResponse.page + 1 : undefined,
          sort: 'date:desc',
        })
      ),
      Effect.flatMap(getResultForPaginatorFormatter())
    );
  };
}

function getResultForPaginatorFormatter(): PaginateChunkEffectPaginatorFormatter<
  OctaneApi.GetMatches,
  RocketLeagueMatch,
  never,
  GetScheduleParamsState
> {
  return function formatResultForPaginator(schedule) {
    return Effect.gen(function* formatResultForPaginatorGenerator(_) {
      let karmineMatchesChunk = Chunk.fromIterable(schedule.matches);
      let shouldContinuePagination = true;

      // Filter by date
      const dateRange = yield* _(Effect.serviceConstants(GetScheduleParamsState).dateRange);
      if (dateRange !== undefined) {
        let enteredInDateRange = false;
        karmineMatchesChunk = Chunk.filter(karmineMatchesChunk, (event) => {
          if (
            (dateRange.start === undefined || event.date >= dateRange.start) &&
            (dateRange.end === undefined || event.date <= dateRange.end)
          ) {
            enteredInDateRange = true;
            return true;
          }
          return false;
        });

        if (!enteredInDateRange) {
          shouldContinuePagination = true;
        }
      }

      // Filter by ignoreIds
      const ignoreIds = yield* _(Effect.serviceConstants(GetScheduleParamsState).ignoreIds);
      if (ignoreIds !== undefined) {
        karmineMatchesChunk = Chunk.filter(
          karmineMatchesChunk,
          (match) => !ignoreIds.includes(Effect.runSync(getMatchId(match)))
        );
      }

      shouldContinuePagination = shouldContinuePagination && schedule.pageSize < schedule.perPage;

      if (!shouldContinuePagination) {
        return [karmineMatchesChunk, Option.none()];
      }

      return [karmineMatchesChunk, Option.some(schedule)];
    });
  };
}
