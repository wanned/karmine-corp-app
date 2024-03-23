import * as Database from '@op-engineering/op-sqlite';
import { Effect, Layer } from 'effect';

import { DatabaseService } from './database-service';

export const createOpSqliteImpl = (databaseName: string) => {
  const DATABASE_VERSION = 1; // TODO: We may use version from package.json
  const database = Database.open({ name: `${databaseName}-${DATABASE_VERSION}` });

  return Layer.succeed(
    DatabaseService,
    DatabaseService.of({
      initializeTables: () =>
        Effect.succeed(
          database
            .prepareStatement('CREATE TABLE IF NOT EXISTS matches (id TEXT PRIMARY KEY, data TEXT)')
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
