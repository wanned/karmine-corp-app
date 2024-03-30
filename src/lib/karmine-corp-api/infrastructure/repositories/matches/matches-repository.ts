import { Effect } from 'effect';

import { DatabaseService } from '../../services/database/database-service';
import { DatabaseSchema } from '../../services/database/types/database-schema';

import { Exact } from '~/lib/karmine-corp-api/types/exact';

export const MatchesRepository = {
  getMatches: ({
    dateRange,
  }: {
    dateRange?: { start?: Date; end?: Date };
  } = {}) => {
    const filters: string[] = [];
    const filterValues: string[] = [];

    if (dateRange?.start) {
      filters.push('timestamp >= ?');
      filterValues.push(dateRange.start.getTime().toString());
    }

    if (dateRange?.end) {
      filters.push('timestamp <= ?');
      filterValues.push(dateRange.end.getTime().toString());
    }

    const whereClause = filters.length ? ` WHERE ${filters.join(' AND ')}` : '';
    const query = `SELECT * FROM matches${whereClause}`;

    return Effect.serviceFunctionEffect(
      DatabaseService,
      (_) => _.executeReturningQuery<DatabaseSchema.Match>
    )(query, filterValues);
  },
  upsertMatches: <T>(matches: Exact<T, DatabaseSchema.Match>[]) =>
    Effect.serviceFunctionEffect(DatabaseService, (_) => _.executeQuery)(
      `INSERT OR REPLACE INTO matches (id, data, timestamp)
       VALUES ${Array(matches.length).fill('(?, ?, ?)').join(', ')}
      `,
      matches.flatMap((match) => [match.id, match.data, match.timestamp.toString()])
    ),
};
