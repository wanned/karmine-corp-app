import { useQueryClient } from '@tanstack/react-query';
import { atom, useAtomValue } from 'jotai';
import { selectAtom } from 'jotai/utils';
import { useCallback, useEffect } from 'react';

import { useDataFetcher } from './use-data-fetcher';
import { groupedMatchesAtom, useAddMatches } from './use-matches';

import { CoreData } from '~/shared/data/core/types';

const liveMatchesAtom = atom((get) => {
  const groupedMatches = get(groupedMatchesAtom);

  const liveMatches = Object.values(groupedMatches)
    .map((matches) => matches.filter((match) => match.status === 'live'))
    .flat()
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return liveMatches;
});

export const useLiveMatches = () => {
  return useAtomValue(
    selectAtom(
      liveMatchesAtom,
      useCallback((liveMatches) => liveMatches, []),
      useCallback((a: CoreData.Match[], b: CoreData.Match[]) => {
        for (let i = 0; i < Math.max(a.length, b.length); i++) {
          if (a[i] !== b[i]) return false;
        }
        return true;
      }, [])
    )
  );
};

export const useInitLiveMatches = () => {
  const dataFetcher = useDataFetcher();
  const queryClient = useQueryClient();

  const addMatches = useAddMatches();

  useEffect(() => {
    dataFetcher.getSchedule({
      filters: { status: ['live'] },
      onResult: addMatches,
    });
  }, [queryClient, dataFetcher]);
};
