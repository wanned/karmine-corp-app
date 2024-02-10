import { useQuery } from '@tanstack/react-query';

import { useDataFetcher } from './use-data-fetcher';

export const usePlayers = () => {
  const dataFetcher = useDataFetcher();

  return useQuery({
    queryKey: ['karmine-teams'],
    queryFn: () => dataFetcher.getPlayers(),
  });
};
