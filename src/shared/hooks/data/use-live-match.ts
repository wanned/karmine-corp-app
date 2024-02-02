import { useQueryClient } from '@tanstack/react-query';
import { atom, useAtomValue } from 'jotai';
import { useEffect } from 'react';

import { useDataFetcher } from './use-data-fetcher';
import { groupedMatchesAtom, useAddMatches } from './use-matches';

const liveMatchesAtom = atom((get) => {
  const groupedMatches = get(groupedMatchesAtom);

  const liveMatches = Object.values(groupedMatches)
    .map((matches) => matches.filter((match) => match.status === 'live'))
    .flat()
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return liveMatches;
});
export const useLiveMatches = () => {
  const liveMatches = useAtomValue(liveMatchesAtom);
  return liveMatches;
};

export const useInitMatchesResults = () => {
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
