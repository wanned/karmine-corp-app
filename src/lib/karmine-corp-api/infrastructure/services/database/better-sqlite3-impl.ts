import Database from 'better-sqlite3';
import { Effect, Layer } from 'effect';

import { DatabaseService } from './database-service';

export const createBetterSqlite3Impl = (databasePath: string = ':memory:') => {
  const database = new Database(databasePath);

  return Layer.succeed(
    DatabaseService,
    DatabaseService.of({
      initializeTables: () =>
        Effect.succeed(
          database.prepare('CREATE TABLE IF NOT EXISTS matches (id TEXT PRIMARY KEY)').run()
        ),
      executeQuery: (query: string, params: string[] = []) => {
        return Effect.succeed(database.prepare(query).run(params) as any);
      },
      executeReturningQuery: (query: string, params: string[] = []) => {
        return Effect.succeed(database.prepare(query).all(params) as any);
      },
    })
  );
};
