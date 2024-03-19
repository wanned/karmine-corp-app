import * as Database from '@op-engineering/op-sqlite';
import { Effect, Layer } from 'effect';

import { DatabaseService } from './database-service';

export const createOpSqliteImpl = (databasePath: string) => {
  const database = Database.open({ name: databasePath });

  return Layer.succeed(
    DatabaseService,
    DatabaseService.of({
      initializeTables: () =>
        Effect.succeed(
          database
            .prepareStatement('CREATE TABLE IF NOT EXISTS matches (id TEXT PRIMARY KEY)')
            .execute()
        ),
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
