import { useQueryClient } from '@tanstack/react-query';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';

import { useDataFetcher } from './use-data-fetcher';

import { CoreData } from '~/shared/data/core/types';

const leaderboardsAtom = atom<CoreData.Leaderboards>({});

export const useLeaderboards = () => {
  return useAtomValue(leaderboardsAtom);
};

export const useInitLeaderboards = () => {
  const dataFetcher = useDataFetcher();
  const queryClient = useQueryClient();

  const setLeaderboards = useSetAtom(leaderboardsAtom);

  useEffect(() => {
    dataFetcher.getLeaderboard({
      onResult: (leaderboards) => setLeaderboards((old) => ({ ...old, ...leaderboards })),
    });
  }, [queryClient, dataFetcher]);
};
