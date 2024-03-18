import { Context, Effect } from 'effect';

const DATABASE_SERVICE_TAG = 'DatabaseService';

export class DatabaseService extends Context.Tag(DATABASE_SERVICE_TAG)<
  DatabaseService,
  {
    initializeTables(): Effect.Effect<void>;
    executeQuery(query: string, params?: string[]): Effect.Effect<void>;
    executeReturningQuery<T>(query: string, params?: string[]): Effect.Effect<T[]>;
  }
>() {}
