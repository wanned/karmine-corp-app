import { Layer } from 'effect';
import { type FetchRequest, ofetch, FetchError } from 'ofetch/dist/index';

import { FetchService } from './fetch-service';
import { FetchOptions } from './types/fetch-options';
import { ResponseType } from './types/response-type';

export const FetchServiceImpl = Layer.succeed(
  FetchService,
  FetchService.of({
    fetch:
      <T, R extends ResponseType = 'json'>(input: FetchRequest, options?: FetchOptions<T, R>) =>
      async (signal: AbortSignal) => {
        const getResponse = async (): Promise<
          NonNullable<Awaited<ReturnType<typeof ofetch.raw<T, R>>>['_data']>
        > => {
          return (await ofetch<T, R>(input, {
            ...options,
            signal,
          }).catch(async (error: FetchError) => {
            if (error.response?.status === 429 && options?.retryHeader) {
              const retryAfter = error.response.headers.get(options.retryHeader);

              if (retryAfter !== null) {
                const retryAfterMs = parseInt(retryAfter, 10) * 1000;

                await new Promise((resolve) => setTimeout(resolve, retryAfterMs));

                return getResponse();
              }
            }

            throw error;
          })) as any;
        };

        return await getResponse();
      },
  })
);
