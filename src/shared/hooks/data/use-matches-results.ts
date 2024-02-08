import { useQueryClient } from '@tanstack/react-query';
import * as datefns from 'date-fns';
import { atom, useAtomValue } from 'jotai';
import { selectAtom } from 'jotai/utils';
import { useCallback, useEffect } from 'react';

import { useDataFetcher } from './use-data-fetcher';
import { groupedMatchesAtom, useAddMatches } from './use-matches';

import { CoreData } from '~/shared/data/core/types';

const matchesResultsAtom = atom((get) => {
  const groupedMatches = get(groupedMatchesAtom);

  const matchesResults = Object.values(groupedMatches)
    .map((matches) => matches.filter((match) => match.status === 'finished'))
    .flat()
    .sort((a, b) => b.date.getTime() - a.date.getTime());

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

export const useInitMatchesResults = () => {
  const dataFetcher = useDataFetcher();
  const queryClient = useQueryClient();

  const addMatches = useAddMatches();

  useEffect(() => {
    dataFetcher.getSchedule({
      filters: { status: ['finished'] },
      batches: [
        // Priority 1: last 24h
        {
          from: datefns.startOfDay(datefns.subDays(new Date(), 1)),
          to: datefns.endOfDay(new Date()),
        },
        // Priority 2: last 3 days
        {
          from: datefns.startOfDay(datefns.subDays(new Date(), 4)),
          to: datefns.endOfDay(datefns.subDays(new Date(), 1)),
        },
        // Priority 3: last 7 days
        {
          from: datefns.startOfDay(datefns.subDays(new Date(), 7)),
          to: datefns.endOfDay(datefns.subDays(new Date(), 4)),
        },
        // Priority 4: last 1 month
        {
          from: datefns.startOfDay(datefns.subMonths(new Date(), 1)),
          to: datefns.endOfDay(datefns.subDays(new Date(), 7)),
        },
      ],
      onResult: addMatches,
    });
  }, [queryClient, dataFetcher]);
};
