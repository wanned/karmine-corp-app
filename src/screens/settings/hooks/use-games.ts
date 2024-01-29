import { useQuery } from '@tanstack/react-query';

import { karmineApi } from '~/shared/apis/karmine/karmine-api';

export const useGames = () => {
  const { data: games } = useQuery({
    queryKey: ['karmineGames'],
    queryFn: karmineApi.getGames,
  });

  return games?.map((game) => game.game_name) ?? [];
};
