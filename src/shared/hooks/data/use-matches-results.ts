import { useQuery } from '@tanstack/react-query';

import { useDataFetcher } from './use-data-fetcher';

export const useMatchesResults = () => {
  const dataFetcher = useDataFetcher();

  const results = useQuery({
    queryKey: ['matchesResults'],
    queryFn: () =>
      dataFetcher
        .getSchedule({ filters: { status: ['finished', 'live'] } })
        .then((matches) => matches.sort((a, b) => b.date.getTime() - a.date.getTime())),
    throwOnError: true,
  });

  return results;
};
