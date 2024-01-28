import { useQueryClient } from '@tanstack/react-query';

import { DataFetcher } from '~/shared/data/core/data-fetcher';

export const useDataFetcher = () => {
  const queryClient = useQueryClient();
  const dataFetcher = new DataFetcher({
    fetch_: async (url, options) => {
      let urlString: string;
      if (typeof url === 'object' && 'url' in url) {
        urlString = url.url;
      } else if (typeof url === 'object' && 'href' in url) {
        urlString = url.href;
      } else {
        urlString = url.toString();
      }

      const queryKey = [urlString, options?.method, options?.body].join(' ');

      return await queryClient.fetchQuery({
        queryKey: [queryKey],
        queryFn: async () => {
          const response = await fetch(url, options);
          const text = await response.text();
          return {
            text: () => Promise.resolve(text),
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            headers: response.headers,
          };
        },
        retry: true,
      });
    },
  });

  return dataFetcher;
};
