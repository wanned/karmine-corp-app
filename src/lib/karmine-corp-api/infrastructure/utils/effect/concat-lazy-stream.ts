import { Chunk, Effect, Stream } from 'effect';

export const concatLazyStream = <A, E, R>(...streams: (() => Stream.Stream<A, E, R>)[]) =>
  Stream.asyncEffect<A, E, R>((emit) => {
    emit.fromEffectChunk(
      Effect.Do.pipe(
        Effect.flatMap(() =>
          Effect.forEach(
            streams,
            (stream) =>
              Stream.runForEach(stream(), (value) => Effect.promise(() => emit.single(value))),
            {
              concurrency: 1,
            }
          )
        ),
        Effect.map(() => Chunk.empty())
      )
    );
    return Effect.void;
  });
