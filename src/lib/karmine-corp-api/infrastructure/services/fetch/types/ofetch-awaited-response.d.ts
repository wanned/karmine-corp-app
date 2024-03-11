import { ofetch } from 'ofetch';
import { ResponseType } from './response-type';

export type OfetchAwaitedResponse<T, R extends ResponseType = 'json'> = ReturnType<
  typeof ofetch<T, R>
> extends Promise<infer U> ?
  U
: never;
