import { useQuery } from '@tanstack/react-query';

import { useDataFetcher } from './use-data-fetcher';

export const useNextMatches = () => {
  const dataFetcher = useDataFetcher();

  const results = useQuery({
    queryKey: ['nextMatches'],
    queryFn: () =>
      dataFetcher
        .getSchedule({ filters: { status: ['upcoming'] } })
        .then((matches) => matches.sort((a, b) => a.date.getTime() - b.date.getTime())),
    throwOnError: true,
  });

  return results;
};
