import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useDataFetcher } from './use-data-fetcher';

import { CoreData } from '~/shared/data/core/types';

export const useMatchesResults = () => {
  const dataFetcher = useDataFetcher();
  const queryClient = useQueryClient();

  useEffect(() => {
    dataFetcher.getSchedule({
      filters: { status: ['finished', 'live'] },
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
