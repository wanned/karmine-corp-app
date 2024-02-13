import '@total-typescript/ts-reset';

import { getStatusFromMatch } from './get-status-from-match';
import { DataFetcher } from '../../../data-fetcher';

const KARMINE_OCTANE_TEAM_ID = '60fbc5b887f814e9fbffdcbd';

export async function getRlMatches({
  apis,
  filters,
}: Pick<DataFetcher.GetScheduleParams, 'filters' | 'apis'>) {
  const paginationResults = [];

  let lastPaginationResult;
  do {
    const results = await apis.octane.getMatches({
      teamId: KARMINE_OCTANE_TEAM_ID,
      ...((lastPaginationResult && { page: lastPaginationResult.page + 1 }) ?? {}),
    });

    const filteredResults = await applyFilters(results.matches, filters);

    if (filteredResults.length === 0) break;

    paginationResults.push({ ...results, matches: filteredResults });
  } while (
    (lastPaginationResult = paginationResults.at(-1)) &&
    lastPaginationResult !== undefined &&
    lastPaginationResult.matches.length > 0 &&
    lastPaginationResult.pageSize >= lastPaginationResult.perPage
  );

  return paginationResults.flatMap((r) => r.matches);
}

async function applyFilters(
  results: Awaited<ReturnType<DataFetcher.Apis['octane']['getMatches']>>['matches'],
  filters: DataFetcher.GetScheduleParams['filters']
) {
  const from = filters.date?.from;
  if (from !== undefined) {
    results = results.filter((match) => new Date(match.date) >= from);
  }

  const to = filters.date?.to;
  if (to !== undefined) {
    results = results.filter((match) => new Date(match.date) <= to);
  }

  const status = filters.status;
  if (status !== undefined) {
    results = await Promise.all(
      results.map(async (match) => {
        if (status.includes(await getStatusFromMatch(match))) return match;
      })
    ).then((matches) => matches.filter(Boolean));
  }

  return results;
}
