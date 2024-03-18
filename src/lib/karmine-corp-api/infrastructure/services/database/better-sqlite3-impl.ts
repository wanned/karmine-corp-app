import Database from 'better-sqlite3';
import { Effect, Layer } from 'effect';

import { DatabaseService } from './database-service';

const database = new Database(':memory:');

export const BetterSqlite3Impl = Layer.succeed(
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
