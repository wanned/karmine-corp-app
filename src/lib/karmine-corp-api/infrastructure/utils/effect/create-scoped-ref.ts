import { ScopedRef, Effect, Option, Data, Scope } from 'effect';

export class ScopeRefNotSet extends Data.TaggedError('ScopeRefNotSet') {}

export const createScopedRef = <T>() => {
  const refs = new Map<Scope.Scope, ScopedRef.ScopedRef<Option.Option<T>>>();

  const init = () =>
    Effect.Do.pipe(
      Effect.flatMap(() => ScopedRef.make<Option.Option<T>>(() => Option.none())),
      Effect.tap((ref) => Effect.scopeWith((scope) => Effect.succeed(refs.set(scope, ref))))
    );

  const findRef = (scope: Scope.Scope) => Option.fromNullable(refs.get(scope));

  const get = () =>
    Effect.scopeWith(findRef).pipe(
      Effect.flatMap(ScopedRef.get),
      Effect.flatMap(
        Option.match({
          onSome: Effect.succeed,
          onNone: () => Effect.fail(new ScopeRefNotSet()),
        })
      )
    );

  const set = (value: T) =>
    Effect.scopeWith(findRef).pipe(
      Effect.flatMap((ref) => ScopedRef.set(ref, Effect.succeed(Option.some(value))))
    );

  return {
    init,
    get,
    set,
  };
};
