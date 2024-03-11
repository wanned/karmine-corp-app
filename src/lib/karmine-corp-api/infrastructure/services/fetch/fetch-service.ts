import { Context } from 'effect';
import type { FetchRequest } from 'ofetch';

import { FetchOptions } from './types/fetch-options';
import { FetchReturn } from './types/fetch-return';
import { ResponseType } from './types/response-type';

const FETCH_SERVICE_TAG = 'FetchService';

export class FetchService extends Context.Tag(FETCH_SERVICE_TAG)<
  FetchService,
  {
    fetch<T, R extends ResponseType = 'json', O extends FetchOptions<T, R> = FetchOptions<T, R>>(
      input: FetchRequest,
      options?: O
    ): (signal: AbortSignal) => FetchReturn<T, R, O>;
  }
>() {}
