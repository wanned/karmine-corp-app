import { useQueryClient } from '@tanstack/react-query';
import * as datefns from 'date-fns';
import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';

import { useDataFetcher } from './use-data-fetcher';
import { groupedMatchesAtom, useAddMatches } from './use-matches';

const nextMatchesAtom = atom((get) => {
  const groupedMatches = get(groupedMatchesAtom);

  const nowTime = new Date().getTime();

  const nextMatches = Object.values(groupedMatches)
    .map((matches) => matches.filter((match) => match.date.getTime() > nowTime))
    .flat()
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return nextMatches;
});
export const useNextMatches = () => {
  const [nextMatches] = useAtom(nextMatchesAtom);
  return nextMatches;
};

export const useInitNextMatches = () => {
  const dataFetcher = useDataFetcher();
  const queryClient = useQueryClient();

  const addMatches = useAddMatches();

  useEffect(() => {
    dataFetcher.getSchedule({
      filters: { status: ['upcoming'] },
      batches: [
        // Priority 1: next 24h
        {
          from: datefns.startOfDay(new Date()),
          to: datefns.endOfDay(datefns.addDays(new Date(), 7)),
        },
        // Priority 2: next 3 days
        {
          from: datefns.startOfDay(datefns.addDays(new Date(), 1)),
          to: datefns.endOfDay(datefns.addDays(new Date(), 7)),
        },
        // Priority 3: next 7 days
        {
          from: datefns.startOfDay(datefns.addDays(new Date(), 4)),
          to: datefns.endOfDay(datefns.addDays(new Date(), 7)),
        },
      ],
      onResult: addMatches,
    });
  }, [queryClient, dataFetcher]);
};
