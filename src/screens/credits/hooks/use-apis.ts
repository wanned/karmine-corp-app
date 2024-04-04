import { useQuery } from '@tanstack/react-query';

export const useApis = () => {
  const fetchApis = async () => {
    const apis = [
      {
        title: 'api2.kametotv.fr/karmine',
      },
      {
        title: 'feed.lolesports.com',
      },
      {
        title: 'esports-api.lolesports.com',
      },
      {
        title: 'ddragon.leagueoflegends.com',
      },
      {
        title: 'liquipedia.net',
      },
      {
        title: 'zsr.octane.gg',
      },
      {
        title: 'flask-api.strafe.com',
      },
      {
        title: 'youtube.com',
      },
      {
        title: 'ungh.cc',
      },
    ];

    return apis;
  };

  return useQuery({
    queryKey: ['apis'],
    queryFn: async () => await fetchApis(),
  });
};
