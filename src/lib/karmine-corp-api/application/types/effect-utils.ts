import { Stream } from 'effect';

export type PaginateChunkEffectPaginatorFormatter<S, A, E, R> = (
  s: S
) => ReturnType<Parameters<typeof Stream.paginateChunkEffect<S, A, E, R>>[1]>;
