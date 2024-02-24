import { atom, useAtomValue } from 'jotai';
import { selectAtom } from 'jotai/utils';
import { useCallback, useEffect } from 'react';

import { useDataFetcher } from './use-data-fetcher';
import { groupedMatchesAtom, useAddMatches } from './use-matches';

import { CoreData } from '~/shared/data/core/types';
import { dayUtils } from '~/shared/utils/days';
import { durationUtils } from '~/shared/utils/duration';

const nextMatchesAtom = atom((get) => {
  const groupedMatches = get(groupedMatchesAtom);

  const nextMatches = Object.values(groupedMatches)
    .map((matches) => matches.filter((match) => match.status === 'upcoming'))
    .flat()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return nextMatches;
});
export const useNextMatches = (n?: number) => {
  return useAtomValue(
    selectAtom(
      nextMatchesAtom,
      useCallback((nextMatches) => (n === undefined ? nextMatches : nextMatches.slice(0, n)), [n]),
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

export const useFetchNextMatches = () => {
  const dataFetcher = useDataFetcher({
    baseQueryKey: 'next-matches',
    cacheTime: durationUtils.toMs.fromMinutes(15),
    // The upcoming matches should not change a lot, but there might be a planning change for the next hour, so we can cache it only for 15 minutes
  });

  const addMatches = useAddMatches();

  const fetchNextMatches = useCallback(
    async ({ interval }: { interval?: number } = {}) => {
      await dataFetcher.getSchedule({
        filters: { status: ['upcoming'] },
        batches: [
          // Priority 1: next 24h
          {
            from: dayUtils.today,
            to: dayUtils.tomorrow,
          },
          // Priority 2: next 3 days
          {
            from: dayUtils.tomorrow,
            to: dayUtils.today.addDays(3),
          },
          // Priority 3: next 7 days
          {
            from: dayUtils.today.addDays(3),
            to: dayUtils.today.addWeeks(1),
          },
        ],
        onResult: addMatches,
      });

      if (interval !== undefined) {
        setTimeout(() => fetchNextMatches({ interval }), interval);
      }
    },
    [dataFetcher, addMatches]
  );

  return fetchNextMatches;
};

export const useInitNextMatches = () => {
  const fetchNextMatches = useFetchNextMatches();

  useEffect(() => {
    fetchNextMatches({ interval: durationUtils.toMs.fromMinutes(15) });
  }, [fetchNextMatches]);
};
