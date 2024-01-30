import { queryOptions, useQueries, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { create } from 'zustand';

import { karmineApi } from '~/shared/apis/karmine/karmine-api';
import { parseMatch } from '~/shared/data/parse-matchs/parse-match';
import { Match } from '~/shared/types/data/Matchs';

interface MatchesResults {
  matchesResults: Match[];
  setMatchesResults: (matches: Match[]) => void;
}

const useMatchesResultsStore = create<MatchesResults>((set) => ({
  matchesResults: [],
  setMatchesResults: (matches) => set({ matchesResults: matches }),
}));

export const useMatchesResults = () => useMatchesResultsStore((state) => state.matchesResults);

export const useInitMatchesResults = () => {
  const setMatchesResults = useMatchesResultsStore((state) => state.setMatchesResults);

  const { data: eventsResults } = useQuery({
    queryKey: ['karmineEventsResults'],
    queryFn: karmineApi.getEventsResults,
  });

  const results = useQueries({
    queries: eventsResults
      ? eventsResults.map((event) => {
          return queryOptions({
            queryKey: ['karmineEventResult', event.id],
            queryFn: () =>
              parseMatch({
                ...event,
                end: '' as any,
                hasNotif: 0,
                streamLink: '',
              }),
          });
        })
      : [],
  });

  useEffect(() => {
    const matchesResults = results
      .map((result) => result.data)
      .filter((data): data is NonNullable<typeof data> => !!data);

    setMatchesResults(matchesResults);
  }, [results]);
};
