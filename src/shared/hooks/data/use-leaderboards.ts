import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect } from 'react';

import { useDataFetcher } from './use-data-fetcher';

import { CoreData } from '~/shared/data/core/types';
import { durationUtils } from '~/shared/utils/duration';

const leaderboardsAtom = atom<CoreData.Leaderboards>({});

export const useLeaderboards = () => {
  return useAtomValue(leaderboardsAtom);
};

export const useFetchLeaderboards = () => {
  const dataFetcher = useDataFetcher({
    baseQueryKey: 'leaderboards',
    cacheTime: durationUtils.toMs.fromMinutes(15),
    // The leaderboards is not likely to change a lot, but it is not a big request, so we can cache it for 15 minutes
  });

  const setLeaderboards = useSetAtom(leaderboardsAtom);

  const fetchLeaderboards = useCallback(
    async ({ interval }: { interval?: number } = {}) => {
      await dataFetcher.getLeaderboard({
        onResult: setLeaderboards,
      });

      if (interval !== undefined) {
        setTimeout(() => fetchLeaderboards({ interval }), interval);
      }
    },
    [dataFetcher, setLeaderboards]
  );

  return fetchLeaderboards;
};

export const useInitLeaderboards = () => {
  const fetchLeaderboards = useFetchLeaderboards();

  useEffect(() => {
    fetchLeaderboards({ interval: durationUtils.toMs.fromMinutes(15) });
  }, [fetchLeaderboards]);
};
