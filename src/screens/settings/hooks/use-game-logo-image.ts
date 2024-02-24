import { useQuery } from '@tanstack/react-query';

import { useDataFetcher } from '~/shared/hooks/data/use-data-fetcher';

export const useGameLogoImage = (gameName: string) => {
  const dataFetcher = useDataFetcher();

  const { data: games } = useQuery({
    queryKey: ['karmineGames'],
    queryFn: dataFetcher.getGames,
  });

  return games?.find((game) => game.game_name === gameName)?.game_picture;
};
