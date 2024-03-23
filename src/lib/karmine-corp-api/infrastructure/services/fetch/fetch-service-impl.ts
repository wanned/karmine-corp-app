import { Layer } from 'effect';

import { FetchService } from './fetch-service';
import { FetchOptions } from './types/fetch-options';

export const FetchServiceImpl = Layer.succeed(
  FetchService,
  FetchService.of({
    fetch:
      <T>(input: string, { parseResponse, query, retryHeader, ...options }: FetchOptions<T> = {}) =>
        async (signal: AbortSignal) => {
          const getResponse = async (): Promise<T> => {
            const searchParams = new URLSearchParams();
            for (const key in query) {
              if (query[key] !== undefined) {
                searchParams.append(key, query[key]);
              }
            }
            const url = `${input}?${searchParams.toString()}`;

            return fetch(url, {
              ...options,
              signal,
            })
              .then(async (response) => {
                if (!response.ok) {
                  throw response;
                }

                if (parseResponse) {
                  return parseResponse(await response.text());
                }

                return response.json();
              })
              .catch(async (error) => {
                if (!(error instanceof Response)) {
                  throw error;
                }

                if (error?.status === 429 && retryHeader) {
                  const retryAfter = error.headers.get(retryHeader);

                  if (retryAfter !== null) {
                    const retryAfterMs = parseInt(retryAfter, 10) * 1000;

                    await new Promise((resolve) => setTimeout(resolve, retryAfterMs));

                    return await getResponse();
                  }
                }

                throw error;
              }) as any;
          }

          return await getResponse();
        },
  })
);
