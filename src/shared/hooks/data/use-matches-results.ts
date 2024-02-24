import { atom, useAtomValue } from 'jotai';
import { selectAtom } from 'jotai/utils';
import { useCallback, useEffect } from 'react';

import { useDataFetcher } from './use-data-fetcher';
import { groupedMatchesAtom, useAddMatches } from './use-matches';

import { CoreData } from '~/shared/data/core/types';
import { dayUtils } from '~/shared/utils/days';
import { durationUtils } from '~/shared/utils/duration';

const matchesResultsAtom = atom((get) => {
  const groupedMatches = get(groupedMatchesAtom);

  const matchesResults = Object.values(groupedMatches)
    .map((matches) => matches.filter((match) => match.status === 'finished'))
    .flat()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return matchesResults;
});
export const useMatchesResults = (n?: number) => {
  return useAtomValue(
    selectAtom(
      matchesResultsAtom,
      useCallback(
        (matchesResults) => (n === undefined ? matchesResults : matchesResults.slice(0, n)),
        [n]
      ),
      useCallback(
        (a: CoreData.Match[], b: CoreData.Match[]) => {
          if (n === undefined) return Object.is(a, b);

          for (let i = 0; i < n; i++) {
            if (a[i] !== b[i]) return false;
          }
          return true;
        },
        [n]
      )
    )
  );
};

export const useFetchMatchesResults = () => {
  const last24hMatchesResultsDataFetcher = useDataFetcher({
    baseQueryKey: 'last-24h-matches-results',
    cacheTime: durationUtils.toMs.fromMinutes(1),
    // A match can pass from 'live' to 'finished' in a minute, so this query will be refetched every minute.
  });
  const otherMatchesResultsDataFetcher = useDataFetcher({
    baseQueryKey: 'other-matches-results',
    cacheTime: Infinity,
    // A finished match is not likely to change. We can cache it indefinitely.
  });

  const addMatches = useAddMatches();

  const fetchMatchesResults = useCallback(
    async ({ interval }: { interval?: number } = {}) => {
      await Promise.allSettled([
        last24hMatchesResultsDataFetcher.getSchedule({
          filters: {
            status: ['finished'],
            date: {
              from: dayUtils.yesterday,
              to: dayUtils.today,
            },
          },
          onResult: addMatches,
        }),
        otherMatchesResultsDataFetcher.getSchedule({
          filters: { status: ['finished'] },
          batches: [
            // Priority 2: last 3 days
            {
              from: dayUtils.today.addDays(-4),
              to: dayUtils.today.addDays(-1),
            },
            // Priority 3: last 7 days
            {
              from: dayUtils.today.addDays(-7),
              to: dayUtils.today.addDays(-4),
            },
            // Priority 4: last 1 month
            {
              from: dayUtils.today.addDays(-30),
              to: dayUtils.today.addDays(-7),
            },
          ],
          onResult: addMatches,
        }),
      ]);

      if (interval !== undefined) {
        setTimeout(() => fetchMatchesResults({ interval }), interval);
      }
    },
    [last24hMatchesResultsDataFetcher, otherMatchesResultsDataFetcher, addMatches]
  );

  return fetchMatchesResults;
};

export const useInitMatchesResults = () => {
  const fetchMatchesResults = useFetchMatchesResults();

  useEffect(() => {
    fetchMatchesResults({ interval: durationUtils.toMs.fromMinutes(1) });
  }, [fetchMatchesResults]);
};
