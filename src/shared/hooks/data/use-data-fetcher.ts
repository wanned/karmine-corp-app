import { useQueryClient, useIsRestoring } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo } from 'react';

import { DataFetcher } from '~/shared/data/core/data-fetcher';

export const useDataFetcher = (
  fetchOptions: {
    baseQueryKey?: string;
    cacheTime?: number;
  } = {}
) => {
  const queryClient = useQueryClient();
  const waitForIsRestoring = useWaitForIsRestoring();

  const fetch_ = useCallback(
    async (url: string, options?: RequestInit) => {
      await waitForIsRestoring();

      const queryKey = [fetchOptions.baseQueryKey, url, options].filter(Boolean);

      const response = await queryClient.ensureQueryData({
        queryKey,
        queryFn: async () => {
          const response = await fetch(url, options);
          return {
            text: await response.text(),
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            headers: response.headers,
          };
        },
        retry: true,
        ...(fetchOptions.cacheTime !== undefined && { staleTime: fetchOptions.cacheTime }),
      });

      if (!response.ok) {
        queryClient.removeQueries({ queryKey });
      }

      return response;
    },
    [queryClient, fetchOptions]
  );

  const dataFetcher = useMemo(() => new DataFetcher({ fetch: fetch_ }), [fetch_]);

  return dataFetcher;
};

const useWaitForIsRestoring = () => {
  const isRestoring = useIsRestoring();
  const { promise, resolve } = useMemo(() => {
    let resolve: () => void;
    const promise = new Promise<void>((r) => {
      resolve = r;
    });
    return { promise, resolve: resolve! };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isRestoring) {
        resolve();
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isRestoring]);

  return useCallback(() => promise, [promise]);
};
