import { useQueryClient } from '@tanstack/react-query';
import * as datefns from 'date-fns';
import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';

import { useDataFetcher } from './use-data-fetcher';
import { groupedMatchesAtom, useAddMatches } from './use-matches';

const matchesResultsAtom = atom((get) => {
  const groupedMatches = get(groupedMatchesAtom);

  const nowTime = new Date().getTime();

  const matchesResults = Object.values(groupedMatches)
    .map((matches) => matches.filter((match) => match.date.getTime() < nowTime))
    .flat()
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  return matchesResults;
});
export const useMatchesResults = () => {
  const [matchesResults] = useAtom(matchesResultsAtom);
  return matchesResults;
};

export const useInitMatchesResults = () => {
  const dataFetcher = useDataFetcher();
  const queryClient = useQueryClient();

  const addMatches = useAddMatches();

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
      onResult: addMatches,
    });
  }, [queryClient, dataFetcher]);
};
