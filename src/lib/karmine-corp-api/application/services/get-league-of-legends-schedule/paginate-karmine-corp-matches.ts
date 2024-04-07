import { Chunk, Effect, Stream, Option } from 'effect';

import { getMatchId } from './convert-to-core-match/utils/get-match-id';
import { PaginateChunkEffectPaginatorFormatter } from '../../types/effect-utils';
import { GetScheduleParamsState } from '../../use-cases/get-schedule/get-schedule-params-state';

import { LeagueOfLegendsApi } from '~/lib/karmine-corp-api/infrastructure/services/league-of-legends-api/league-of-legends-api';
import { LeagueOfLegendsApiService } from '~/lib/karmine-corp-api/infrastructure/services/league-of-legends-api/league-of-legends-api-service';
import { createScopedRef } from '~/lib/karmine-corp-api/infrastructure/utils/effect/create-scoped-ref';

type LeagueOfLegendsMatch = LeagueOfLegendsApi.GetSchedule['data']['schedule']['events'][number];

interface PaginateKarmineCorpMatchesParams {
  leagueId: string;
}

const {
  init: initPaginateKarmineCorpMatchesParamsRef,
  get: getPaginateKarmineCorpMatchesParams,
  set: setPaginateKarmineCorpMatchesParams,
} = createScopedRef<PaginateKarmineCorpMatchesParams>();

export function paginateKarmineCorpMatches({ leagueId }: PaginateKarmineCorpMatchesParams) {
  return Stream.paginateChunkEffect(
    undefined as LeagueOfLegendsApi.GetSchedule | undefined,
    (lastResponse) =>
      Effect.scoped(
        Effect.Do.pipe(
          Effect.tap(() => initPaginateKarmineCorpMatchesParamsRef()),
          Effect.tap(() => setPaginateKarmineCorpMatchesParams({ leagueId })),
          Effect.flatMap(() => getNextMatchesGetter()(lastResponse))
        )
      )
  );
}

function getNextMatchesGetter() {
  return function getNextMatches(lastResponse: LeagueOfLegendsApi.GetSchedule | undefined) {
    const olderToken = lastResponse?.data.schedule.pages.older ?? undefined;

    return Effect.Do.pipe(
      Effect.flatMap(() => getPaginateKarmineCorpMatchesParams()),
      Effect.flatMap(({ leagueId }) =>
        Effect.serviceMembers(LeagueOfLegendsApiService).functions.getSchedule({
          leagueIds: [leagueId],
          pageToken: olderToken,
        })
      ),
      Effect.flatMap(getResultForPaginatorFormatter())
    );
  };
}

function getResultForPaginatorFormatter(): PaginateChunkEffectPaginatorFormatter<
  LeagueOfLegendsApi.GetSchedule,
  LeagueOfLegendsMatch,
  never,
  GetScheduleParamsState
> {
  return function formatResultForPaginator(schedule) {
    return Effect.gen(function* formatResultForPaginatorGenerator(_) {
      let karmineMatchesChunk = Chunk.filter(
        Chunk.fromIterable(schedule.data.schedule.events),
        (match) => match.match.teams.some((team) => team.name.toLowerCase().includes('karmine'))
      );
      let shouldContinuePagination = true;

      // Filter by date
      const dateRange = yield* _(Effect.serviceConstants(GetScheduleParamsState).dateRange);
      if (dateRange !== undefined) {
        let enteredInDateRange = false;
        karmineMatchesChunk = Chunk.filter(karmineMatchesChunk, (event) => {
          if (
            (dateRange.start === undefined || event.startTime >= dateRange.start) &&
            (dateRange.end === undefined || event.startTime <= dateRange.end)
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

      shouldContinuePagination =
        shouldContinuePagination && schedule.data.schedule.pages.older !== null;

      if (!shouldContinuePagination) {
        return [karmineMatchesChunk, Option.none()];
      }

      return [karmineMatchesChunk, Option.some(schedule)];
    });
  };
}
