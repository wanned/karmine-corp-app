import { useQuery } from '@tanstack/react-query';

import { useDataFetcher } from './use-data-fetcher';

export const useYoutubeVideos = () => {
  const dataFetcher = useDataFetcher();

  return useQuery({
    queryKey: ['youtube-videos'],
    queryFn: dataFetcher.getYoutubeVideos,
  });
};
