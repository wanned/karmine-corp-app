import { Effect, Stream } from 'effect';
import type { DurationInput } from 'effect/Duration';

export const delayedStream = <A, E, R>(stream: Stream.Stream<A, E, R>, duration: DurationInput) =>
  Stream.Do.pipe(
    Stream.mapEffect(() =>
      Effect.delay(
        Effect.sync(() => stream),
        duration
      )
    ),
    (_) => Stream.flatten(_)
  );
