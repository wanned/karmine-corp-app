import { Effect } from 'effect';
import { z } from 'zod';

export const parseZod = <S extends z.Schema>(schema: S, data: unknown, errorDetails?: string) =>
  Effect.Do.pipe(
    () => schema.safeParse(data),
    (parseResult) => {
      if (parseResult.success) {
        return Effect.succeed(parseResult.data as z.output<S>);
      } else {
        return Effect.fail(Object.assign(parseResult.error, { errorDetails }));
      }
    }
  );
