import { useQuery } from '@tanstack/react-query';

import { useDataFetcher } from './use-data-fetcher';

export const useTeams = () => {
  const dataFetcher = useDataFetcher();

  return useQuery({
    queryKey: ['karmine-teams'],
    queryFn: () => dataFetcher.getTeams(),
  });
};
