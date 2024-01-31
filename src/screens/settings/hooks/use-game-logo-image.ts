import { useQuery } from '@tanstack/react-query';

import { KarmineApiClient } from '~/shared/data/external-apis/karmine/karmine-api-client';

export const useGameLogoImage = (gameName: string) => {
  const { data: games } = useQuery({
    queryKey: ['karmineGames'],
    queryFn: new KarmineApiClient().getGames,
  });

  return games?.find((game) => game.game_name === gameName)?.game_picture;
};
