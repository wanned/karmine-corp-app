import { Chunk, Effect, Stream, Option } from 'effect';
import parseHtml, { HTMLElement } from 'node-html-parser';

import { getMatchDate } from './convert-to-core-match/utils/get-match-date';
import { getMatchId } from './convert-to-core-match/utils/get-match-id';
import { karmineCorpTeams } from './karmine-corp-teams';
import { PaginateChunkEffectPaginatorFormatter } from '../../types/effect-utils';
import { GetScheduleParamsState } from '../../use-cases/get-schedule/get-schedule-params-state';

import { VlrGgApiService } from '~/lib/karmine-corp-api/infrastructure/services/vlr-gg-api/vlr-gg-api-service';

export function paginateKarmineCorpMatches() {
  return Stream.mergeAll(
    Object.values(karmineCorpTeams).flatMap((team) =>
      (['upcoming', 'completed'] as const).map((status) =>
        Stream.paginateChunkEffect(undefined as HTMLElement | undefined, (lastResponse) =>
          Effect.scoped(getNextMatchesGetter({ status, teamId: team.vlrGgTeamId })(lastResponse))
        )
      )
    ),
    {
      concurrency: 1,
    }
  );
}

function getNextMatchesGetter({
  status,
  teamId,
}: {
  status: 'completed' | 'upcoming';
  teamId: string;
}) {
  return function getNextMatches(lastResponse: HTMLElement | undefined) {
    return Effect.Do.pipe(
      Effect.flatMap(() =>
        Effect.serviceMembers(VlrGgApiService).functions.getMatches({
          status,
          teamId,
          page: getNextPageNumber(lastResponse),
        })
      ),
      Effect.map((response) => parseHtml(response.html)),
      Effect.flatMap(getResultForPaginatorFormatter())
    );
  };
}

function getNextPageNumber(page: HTMLElement | undefined) {
  const nextPageStr =
    page ? page.querySelector('.mod-page.mod-active + .mod-page')?.text : undefined;
  return nextPageStr !== undefined ? Number(nextPageStr) : undefined;
}

function getResultForPaginatorFormatter(): PaginateChunkEffectPaginatorFormatter<
  HTMLElement,
  HTMLElement,
  never,
  GetScheduleParamsState
> {
  return function formatResultForPaginator(page) {
    return Effect.gen(function* formatResultForPaginatorGenerator(_) {
      let karmineMatchElementsChunk = Chunk.fromIterable(page.querySelectorAll(':has(> .m-item)'));
      let shouldContinuePagination = true;

      // Filter by date
      const dateRange = yield* _(Effect.serviceConstants(GetScheduleParamsState).dateRange);
      if (dateRange !== undefined) {
        let enteredInDateRange = false;
        karmineMatchElementsChunk = Chunk.filter(
          karmineMatchElementsChunk,
          (karmineMatchElement) => {
            const matchDate = getMatchDate(karmineMatchElement);
            if (matchDate === undefined) {
              return true; // If date is not found, we can't filter by date, so we keep the element
            }

            if (
              (dateRange.start === undefined || matchDate >= dateRange.start) &&
              (dateRange.end === undefined || matchDate <= dateRange.end)
            ) {
              enteredInDateRange = true;
              return true;
            }

            return false;
          }
        );

        if (!enteredInDateRange) {
          shouldContinuePagination = true;
        }
      }

      // Filter by ignoreIds
      const ignoreIds = yield* _(Effect.serviceConstants(GetScheduleParamsState).ignoreIds);
      if (ignoreIds !== undefined) {
        karmineMatchElementsChunk = Chunk.filter(
          karmineMatchElementsChunk,
          (match) => !ignoreIds.includes(Effect.runSync(getMatchId(match)))
        );
      }

      shouldContinuePagination = shouldContinuePagination && getNextPageNumber(page) !== undefined;

      if (!shouldContinuePagination) {
        return [karmineMatchElementsChunk, Option.none()];
      }

      return [karmineMatchElementsChunk, Option.some(page)];
    });
  };
}
