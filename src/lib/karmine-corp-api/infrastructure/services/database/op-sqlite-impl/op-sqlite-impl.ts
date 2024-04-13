import * as Database from '@op-engineering/op-sqlite';
import { drizzle } from 'drizzle-orm/op-sqlite';
import { migrate } from 'drizzle-orm/op-sqlite/migrator';
import { Effect, Layer } from 'effect';

import migrations from './migrations/migrations';
import { DatabaseService } from '../database-service';

export const createOpSqliteImpl = (databaseName: string) => {
  const database = Database.open({ name: databaseName });

  return Layer.succeed(
    DatabaseService,
    DatabaseService.of({
      initializeTables: () =>
        Effect.promise(async () => await migrate(drizzle(database), migrations)),
      executeQuery: (query: string, params: string[] = []) => {
        return Effect.promise(() => database.executeAsync(query, params));
      },
      executeReturningQuery: (query: string, params: string[] = []) => {
        return Effect.promise(async () => {
          const { rows } = await database.executeAsync(query, params);
          return rows?._array ?? [];
        });
      },
    })
  );
};
