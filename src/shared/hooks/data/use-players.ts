import { useQuery } from '@tanstack/react-query';

import { useDataFetcher } from './use-data-fetcher';

import { durationUtils } from '~/shared/utils/duration';

export const usePlayers = () => {
  const dataFetcher = useDataFetcher();

  return useQuery({
    queryKey: ['karmine-teams'],
    queryFn: () => dataFetcher.getPlayers(),
    refetchInterval: durationUtils.toMs.fromMinutes(5),
  });
};
