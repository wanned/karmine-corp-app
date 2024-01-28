import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as datefns from 'date-fns';
import { useEffect } from 'react';

import { useDataFetcher } from './use-data-fetcher';

import { CoreData } from '~/shared/data/core/types';

export const useMatchesResults = () => {
  const dataFetcher = useDataFetcher();
  const queryClient = useQueryClient();

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
      onResult: (newMatch) => {
        queryClient.setQueryData<CoreData.Match[]>(['matchesResults'], (matches = []) => {
          const matchIndex = matches?.findIndex((match) => match.id === newMatch.id);

          if (matchIndex === -1) {
            return [...matches, newMatch];
          }

          return [...matches.slice(0, matchIndex), newMatch, ...matches.slice(matchIndex + 1)];
        });
      },
    });
  }, [queryClient, dataFetcher]);

  const results = useQuery<CoreData.Match[]>({
    queryKey: ['matchesResults'],
    select: (matches) => matches.sort((a, b) => b.date.getTime() - a.date.getTime()),
  });

  return results;
};
