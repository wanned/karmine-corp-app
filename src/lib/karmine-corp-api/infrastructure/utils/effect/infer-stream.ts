import { Stream } from 'effect';

export type InferStream<S> =
  S extends Stream.Stream<infer A, infer E, infer R> ?
    {
      A: A;
      E: E;
      R: R;
    }
  : never;
