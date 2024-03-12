import '@total-typescript/ts-reset';

import { getStatusFromMatch } from './get-status-from-match';
import { DataFetcher } from '../../../data-fetcher';
import { RLMatch } from './types';

const KARMINE_OCTANE_TEAM_ID = '60fbc5b887f814e9fbffdcbd';

export async function getRlMatches({
  apis,
  filters,
}: Pick<DataFetcher.GetScheduleParams, 'filters' | 'apis'>) {
  const paginationResults = [];

  let lastPaginationResult;
  do {
    paginationResults.push(
      await apis.octane.getMatches({
        teamId: KARMINE_OCTANE_TEAM_ID,
        ...((lastPaginationResult && { page: lastPaginationResult.page + 1 }) ?? {}),
      })
    );
  } while (
    (lastPaginationResult = paginationResults.at(-1)) &&
    lastPaginationResult !== undefined &&
    lastPaginationResult.matches.length > 0 &&
    lastPaginationResult.pageSize >= lastPaginationResult.perPage &&
    (await checkFilters(lastPaginationResult.matches, filters)) !== undefined
  );
  return paginationResults.flatMap((r) => r.matches);
}

async function checkFilters(
  results: Awaited<ReturnType<typeof getRlMatches>>,
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

  // filters.status
  const status = filters.status;
  if (status !== undefined) {
    results = await Promise.all(
      results.map(async (match) => {
        if (status.includes(await getStatusFromMatch(match))) return match;
      })
    ).then((matches) => matches.filter(Boolean));
  }

  if (results.length === 0) return undefined;
  return results.map(setScoresToUndefinedIfNotStarted);
}

function setScoresToUndefinedIfNotStarted(match: RLMatch): RLMatch {
  const currentDate = new Date();
  if (match.date > currentDate) {
    const modifiedMatch: RLMatch = {
      ...match,
      blue: { ...match.blue, score: undefined },
      orange: { ...match.orange, score: undefined },
    };
    return modifiedMatch;
  }
  return match;
}
