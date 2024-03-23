import { Context } from 'effect';

import { FetchOptions } from './types/fetch-options';
import { FetchReturn } from './types/fetch-return';

const FETCH_SERVICE_TAG = 'FetchService';

export class FetchService extends Context.Tag(FETCH_SERVICE_TAG)<
  FetchService,
  {
    fetch<T, O extends FetchOptions<T> = FetchOptions<T>>(
      input: string,
      options?: O
    ): (signal: AbortSignal) => FetchReturn<T>;
  }
>() {}
