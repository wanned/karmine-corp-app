import { useQueryClient } from '@tanstack/react-query';
import * as datefns from 'date-fns';
import { useEffect } from 'react';
import { create } from 'zustand';

import { useDataFetcher } from './use-data-fetcher';

import { CoreData } from '~/shared/data/core/types';

interface MatchesResults {
  matchesResults: CoreData.Match[];
  addMatchResult: (match: CoreData.Match) => void;
}

const useMatchesResultsStore = create<MatchesResults>((set) => ({
  matchesResults: [],
  addMatchResult: (newMatch: CoreData.Match) =>
    set((state) => {
      const matchIndex = state.matchesResults?.findIndex((match) => match.id === newMatch.id);

      if (matchIndex === -1) {
        return {
          matchesResults: [...state.matchesResults, newMatch],
        };
      }

      return {
        matchesResults: [
          ...state.matchesResults.slice(0, matchIndex),
          newMatch,
          ...state.matchesResults.slice(matchIndex + 1),
        ],
      };
    }),
}));

export const useMatchesResults = () =>
  useMatchesResultsStore((state) =>
    [...state.matchesResults].sort((a, b) => b.date.getTime() - a.date.getTime())
  );

export const useInitMatchesResults = () => {
  const dataFetcher = useDataFetcher();
  const queryClient = useQueryClient();

  const addMatchResult = useMatchesResultsStore((state) => state.addMatchResult);

  useEffect(() => {
    dataFetcher.getSchedule({
      filters: { status: ['finished', 'live'] },
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
      onResult: addMatchResult,
    });
  }, [queryClient, dataFetcher]);
};
