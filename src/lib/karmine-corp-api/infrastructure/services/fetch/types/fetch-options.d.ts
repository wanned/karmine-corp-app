import type { FetchOptions as _FetchOptions } from 'ofetch';
import { ResponseType } from './response-type';

export interface FetchOptions<T, R extends ResponseType = 'json'>
  extends Omit<_FetchOptions<R>, 'signal'> {
  parseResponse?: (responseText: string) => T;
  retryHeader?: string;
}
