import { queryOptions, useQueries, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { create } from 'zustand';

import { karmineApi } from '~/shared/apis/karmine/karmine-api';
import { parseMatch } from '~/shared/data/parse-matchs/parse-match';
import { Match } from '~/shared/types/data/Matchs';

interface NextMatches {
  nextMatches: Match[];
  setNextMatches: (matches: Match[]) => void;
}

const useNextMatchesStore = create<NextMatches>((set) => ({
  nextMatches: [],
  setNextMatches: (matches) => set({ nextMatches: matches }),
}));

export const useNextMatches = () => useNextMatchesStore((state) => state.nextMatches);

export const useInitNextMatches = () => {
  const setNextMatches = useNextMatchesStore((state) => state.setNextMatches);

  const { data: events } = useQuery({
    queryKey: ['karmineEvents'],
    queryFn: karmineApi.getEvents,
  });

  const results = useQueries({
    queries: events
      ? events.map((event) => {
          return queryOptions({
            queryKey: ['karmineEvent', event.id],
            queryFn: () => parseMatch(event),
          });
        })
      : [],
  });

  useEffect(() => {
    const nextMatches = results
      .map((result) => result.data)
      .filter((data): data is NonNullable<typeof data> => !!data);

    setNextMatches(nextMatches);
  }, [results]);
};
