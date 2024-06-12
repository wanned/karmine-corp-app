import { Chunk, Effect, Stream, Option } from 'effect';

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
      const karmineMatchesChunk = Chunk.fromIterable(schedule.matches);
      const shouldContinuePagination = schedule.pageSize < schedule.perPage;

      if (!shouldContinuePagination) {
        return [karmineMatchesChunk, Option.none()];
      }

      return [karmineMatchesChunk, Option.some(schedule)];
    });
  };
}
