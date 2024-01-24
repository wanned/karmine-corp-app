import { useQuery } from '@tanstack/react-query';

import { karmineApi } from '~/shared/apis/karmine/karmine-api';

export const useGameLogoImage = (gameName: string) => {
  const { data: games } = useQuery({
    queryKey: ['karmineGames'],
    queryFn: karmineApi.getGames,
  });

  return games?.find((game) => game.game_name === gameName)?.game_picture;
};
