import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { Effect, Layer } from 'effect';
import path from 'node:path';

import { createBetterSqlite3Impl } from './better-sqlite3-impl';
import { DatabaseService } from './database-service';

export const createBetterSqlite3WithDrizzleImpl = (databasePath: string = ':memory:') => {
  const provideBaseDb = Effect.provide(createBetterSqlite3Impl(databasePath));
  const database = Database(databasePath);

  return Layer.unwrapEffect(
    Effect.Do.pipe(
      provideBaseDb,
      Effect.map(() => ({
        executeQuery: Effect.serviceFunction(DatabaseService, (_) => _.executeQuery),
        executeReturningQuery: Effect.serviceFunction(
          DatabaseService,
          (_) => _.executeReturningQuery
        ),
      })),
      Effect.map((_) =>
        Layer.succeed(
          DatabaseService,
          DatabaseService.of({
            executeQuery: (...args) => Effect.flatten(provideBaseDb(_.executeQuery(...args))),
            executeReturningQuery: (...args) =>
              Effect.flatten(provideBaseDb(_.executeReturningQuery(...args))),
            initializeTables: () =>
              Effect.sync(() =>
                migrate(drizzle(database), {
                  migrationsFolder: path.join(__dirname, 'op-sqlite-impl', 'migrations'),
                })
              ),
          })
        )
      )
    )
  );
};
