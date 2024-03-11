import { Layer } from 'effect';
import { type FetchRequest, ofetch } from 'ofetch';

import { FetchService } from './fetch-service';
import { FetchOptions } from './types/fetch-options';
import { ResponseType } from './types/response-type';

export const FetchServiceImpl = Layer.succeed(
  FetchService,
  FetchService.of({
    fetch:
      <T, R extends ResponseType = 'json'>(input: FetchRequest, options?: FetchOptions<T, R>) =>
      async (signal: AbortSignal) =>
        ofetch<T, R>(input, { ...options, signal }),
  })
);
