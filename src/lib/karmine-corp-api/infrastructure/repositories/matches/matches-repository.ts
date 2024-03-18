import { Effect } from 'effect';

import { DatabaseService } from '../../services/database/database-service';
import { DatabaseSchema } from '../../services/database/types/database-schema';

import { Exact } from '~/lib/karmine-corp-api/types/exact';

export const MatchesRepository = {
  getAllMatches: () =>
    DatabaseService.pipe(
      Effect.flatMap((_) => _.executeReturningQuery<DatabaseSchema.Match>('SELECT * FROM matches'))
    ),
  upsertMatches: <T>(matches: Exact<T, DatabaseSchema.Match>[]) =>
    DatabaseService.pipe(
      Effect.flatMap((_) =>
        _.executeQuery(
          `INSERT OR REPLACE INTO matches (id, data)
           VALUES ${Array(matches.length).fill('(?, ?)').join(', ')}
          `,
          matches.flatMap((match) => [match.id, match.data])
        )
      )
    ),
};
