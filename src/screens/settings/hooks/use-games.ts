import { useQuery } from '@tanstack/react-query';

import { useDataFetcher } from '~/shared/hooks/data/use-data-fetcher';

export const useGames = () => {
  const dataFetcher = useDataFetcher();

  const { data: games } = useQuery({
    queryKey: ['karmineGames'],
    queryFn: dataFetcher.getGames,
  });

  return games?.map((game) => game.game_name) ?? [];
};
