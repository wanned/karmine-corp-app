import { atom, useAtomValue } from 'jotai';
import { selectAtom } from 'jotai/utils';
import { useCallback, useEffect } from 'react';

import { useDataFetcher } from './use-data-fetcher';
import { groupedMatchesAtom, useAddMatches } from './use-matches';

import { CoreData } from '~/shared/data/core/types';
import { durationUtils } from '~/shared/utils/duration';

const liveMatchesAtom = atom((get) => {
  const groupedMatches = get(groupedMatchesAtom);

  const liveMatches = Object.values(groupedMatches)
    .map((matches) => matches.filter((match) => match.status === 'live'))
    .flat()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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

export const useFetchLiveMatches = () => {
  const dataFetcher = useDataFetcher({
    baseQueryKey: 'live-matches',
    cacheTime: durationUtils.toMs.fromMinutes(1),
    // The live matches are very likely to change, so this query will be refetched every minute.
  });

  const addMatches = useAddMatches();

  const fetchLiveMatches = useCallback(
    async ({ interval }: { interval?: number } = {}) => {
      await dataFetcher.getSchedule({
        filters: { status: ['live'] },
        onResult: addMatches,
      });

      if (interval !== undefined) {
        setTimeout(() => fetchLiveMatches({ interval }), interval);
      }
    },
    [dataFetcher, addMatches]
  );

  return fetchLiveMatches;
};

export const useInitLiveMatches = () => {
  const fetchLiveMatches = useFetchLiveMatches();

  useEffect(() => {
    fetchLiveMatches({ interval: durationUtils.toMs.fromMinutes(1) });
  }, [fetchLiveMatches]);
};
