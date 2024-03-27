import { useQuery } from '@tanstack/react-query';

import { useDataFetcher } from './use-data-fetcher';

import { durationUtils } from '~/shared/utils/duration';

export const useYoutubeVideos = () => {
  const dataFetcher = useDataFetcher();

  return useQuery({
    queryKey: ['youtube-videos'],
    queryFn: async () => await dataFetcher.getYoutubeVideos(),
    refetchInterval: durationUtils.toMs.fromMinutes(5),
  });
};
