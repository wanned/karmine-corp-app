import { useQuery } from '@tanstack/react-query';

export const useApis = () => {
  const fetchApis = async () => {
    return [
      'api2.kametotv.fr/karmine',
      'feed.lolesports.com',
      'esports-api.lolesports.com',
      'ddragon.leagueoflegends.com',
      'liquipedia.net',
      'zsr.octane.gg',
      'flask-api.strafe.com',
      'youtube.com',
      'ungh.cc',
    ].map((api) => ({ title: api }));
  };

  return useQuery({
    queryKey: ['apis'],
    queryFn: async () => await fetchApis(),
  });
};
