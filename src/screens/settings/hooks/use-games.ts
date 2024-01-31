import { useQuery } from '@tanstack/react-query';

import { KarmineApiClient } from '~/shared/data/external-apis/karmine/karmine-api-client';

export const useGames = () => {
  const { data: games } = useQuery({
    queryKey: ['karmineGames'],
    queryFn: new KarmineApiClient().getGames,
  });

  return games?.map((game) => game.game_name) ?? [];
};
