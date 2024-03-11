import { FetchOptions } from './fetch-options';
import { OfetchAwaitedResponse } from './ofetch-awaited-response';
import { ResponseType } from './response-type';

export type FetchReturn<
  T,
  R extends ResponseType = 'json',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _O extends FetchOptions<T, R> = FetchOptions<T, R>,
> = Promise<OfetchAwaitedResponse<T, R>>;
