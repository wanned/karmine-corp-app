import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const matches = sqliteTable('matches', {
  id: text('id').primaryKey(),
  data: text('data'),
  timestamp: integer('timestamp'),
});
