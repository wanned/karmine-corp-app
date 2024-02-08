import { useQueryClient } from '@tanstack/react-query';
import * as datefns from 'date-fns';
import { atom, useAtomValue } from 'jotai';
import { selectAtom } from 'jotai/utils';
import { useCallback, useEffect } from 'react';

import { useDataFetcher } from './use-data-fetcher';
import { groupedMatchesAtom, useAddMatches } from './use-matches';

import { CoreData } from '~/shared/data/core/types';

const nextMatchesAtom = atom((get) => {
  const groupedMatches = get(groupedMatchesAtom);

  const nextMatches = Object.values(groupedMatches)
    .map((matches) => matches.filter((match) => match.status === 'upcoming'))
    .flat()
    .sort((a, b) => a.date.getTime() - b.date.getTime());

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

export const useInitNextMatches = () => {
  const dataFetcher = useDataFetcher();
  const queryClient = useQueryClient();

  const addMatches = useAddMatches();

  useEffect(() => {
    dataFetcher.getSchedule({
      filters: { status: ['upcoming'] },
      batches: [
        // Priority 1: next 24h
        {
          from: datefns.startOfDay(new Date()),
          to: datefns.endOfDay(datefns.addDays(new Date(), 7)),
        },
        // Priority 2: next 3 days
        {
          from: datefns.startOfDay(datefns.addDays(new Date(), 1)),
          to: datefns.endOfDay(datefns.addDays(new Date(), 7)),
        },
        // Priority 3: next 7 days
        {
          from: datefns.startOfDay(datefns.addDays(new Date(), 4)),
          to: datefns.endOfDay(datefns.addDays(new Date(), 7)),
        },
      ],
      onResult: addMatches,
    });
  }, [queryClient, dataFetcher]);
};
