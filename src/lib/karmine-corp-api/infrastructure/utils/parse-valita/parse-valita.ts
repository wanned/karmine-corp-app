import * as v from '@badrap/valita';
import { Effect, Option } from 'effect';

export const parseValita = <S extends v.Type>(schema: S, data: unknown, errorDetails?: string) =>
  Effect.Do.pipe(
    Effect.map(() => schema.parse(data, { mode: 'strip' })),
    Effect.catchSomeDefect((defect) =>
      defect instanceof v.ValitaError ?
        Option.some(Effect.fail(Object.assign(defect, { errorDetails })))
      : Option.none()
    )
  );
