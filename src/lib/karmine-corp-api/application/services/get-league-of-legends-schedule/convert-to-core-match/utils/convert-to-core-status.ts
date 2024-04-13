import { Effect, Match } from 'effect';

type StatusMapping = {
  completed: 'finished';
  finished: 'finished';
  in_game: 'live';
  inProgress: 'live';
  live: 'live';
  unstarted: 'upcoming';
};

export function convertToCoreStatus<
  T extends 'completed' | 'finished' | 'in_game' | 'inProgress' | 'live' | 'unstarted',
>(status: T) {
  return Effect.succeed(
    Match.value(
      status as 'completed' | 'finished' | 'in_game' | 'inProgress' | 'live' | 'unstarted'
    ).pipe(
      Match.when('finished', () => 'finished' as const),
      Match.when('completed', () => 'finished' as const),
      Match.when('live', () => 'live' as const),
      Match.when('inProgress', () => 'live' as const),
      Match.when('in_game', () => 'live' as const),
      Match.when('unstarted', () => 'upcoming' as const),
      Match.exhaustive
    )
  ) as Effect.Effect<StatusMapping[T]>;
}
