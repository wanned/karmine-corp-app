import { useQueryClient } from '@tanstack/react-query';
import * as datefns from 'date-fns';
import { useEffect } from 'react';
import { create } from 'zustand';

import { useDataFetcher } from './use-data-fetcher';

import { CoreData } from '~/shared/data/core/types';

interface NextMatches {
  nextMatches: CoreData.Match[];
  addMatchResult: (match: CoreData.Match) => void;
}

const useNextMatchesStore = create<NextMatches>((set) => ({
  nextMatches: [],
  addMatchResult: (newMatch: CoreData.Match) =>
    set((state) => {
      const matchIndex = state.nextMatches?.findIndex((match) => match.id === newMatch.id);

      if (matchIndex === -1) {
        return {
          nextMatches: [...state.nextMatches, newMatch],
        };
      }

      return {
        nextMatches: [
          ...state.nextMatches.slice(0, matchIndex),
          newMatch,
          ...state.nextMatches.slice(matchIndex + 1),
        ],
      };
    }),
}));

export const useNextMatches = () =>
  useNextMatchesStore((state) =>
    [...state.nextMatches].sort((a, b) => a.date.getTime() - b.date.getTime())
  );

export const useInitNextMatches = () => {
  const dataFetcher = useDataFetcher();
  const queryClient = useQueryClient();

  const addMatchResult = useNextMatchesStore((state) => state.addMatchResult);

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
      onResult: addMatchResult,
    });
  }, [queryClient, dataFetcher]);
};
