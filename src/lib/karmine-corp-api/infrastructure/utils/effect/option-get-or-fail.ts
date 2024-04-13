import { Option, Effect } from 'effect';

type OptionGetOrFailReturn<T, E> = Effect.Effect<T, E, never>;

export function optionGetOrFail<T, E>(
  option: Option.Option<T>,
  err: E
): OptionGetOrFailReturn<T, E>;
export function optionGetOrFail<T, E>(
  err: E
): (option: Option.Option<T>) => OptionGetOrFailReturn<T, E>;
export function optionGetOrFail<T, E>(optionOrErr: Option.Option<T> | E, err?: E) {
  if (err) {
    return optionGetOrFail(err)(optionOrErr as Option.Option<T>);
  }

  return (option: Option.Option<T>) =>
    Effect.Do.pipe(
      Effect.map(() => option),
      Effect.flatMap(
        Option.match({
          onSome: (value) => Effect.succeed(value),
          onNone: () => Effect.fail(optionOrErr as E),
        })
      )
    );
}
