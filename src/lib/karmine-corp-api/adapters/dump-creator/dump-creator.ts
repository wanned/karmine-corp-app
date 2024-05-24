import { Chunk, Effect, Layer, Stream } from 'effect';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { CoreData } from '../../application/types/core-data';
import { getSchedule } from '../../application/use-cases/get-schedule/get-schedule';
import { createGetScheduleParamsStateImpl } from '../../application/use-cases/get-schedule/get-schedule-params-state';
import { createBetterSqlite3WithDrizzleImpl } from '../../infrastructure/services/database/better-sqlite3-with-drizzle-impl';
import { DatabaseService } from '../../infrastructure/services/database/database-service';
import { createEnvServiceImpl } from '../../infrastructure/services/env/env-service-impl';
import { FetchServiceImpl } from '../../infrastructure/services/fetch/fetch-service-impl';
import { KarmineApiServiceImpl } from '../../infrastructure/services/karmine-api/karmine-api-service-impl';
import { LeagueOfLegendsApiServiceImpl } from '../../infrastructure/services/league-of-legends-api/league-of-legends-api-service-impl';
import { OctaneApiServiceImpl } from '../../infrastructure/services/octane-api/octane-api-service-impl';
import { StrafeApiServiceImpl } from '../../infrastructure/services/strafe-api/strafe-api-service-impl';
import { VlrGgApiServiceImpl } from '../../infrastructure/services/vlr-gg-api/vlr-gg-api-service-impl';

import { IsoDate } from '~/shared/types/IsoDate';

const dumpPathArgIndex = process.argv.findIndex((arg) => arg === '--dump-path');
if (dumpPathArgIndex === -1) {
  console.error('Dump path not provided');
  process.exit(1);
}

const dumpPath = process.argv[dumpPathArgIndex + 1];
if (!dumpPath) {
  console.error('Dump path not provided');
  process.exit(1);
}

const databaseDumpPath = path.join(process.cwd(), `${dumpPath}.db`);
const jsonDumpPath = path.join(process.cwd(), `${dumpPath}.json`);

export const createDump = () =>
  Effect.Do.pipe(
    Effect.flatMap(() =>
      Effect.serviceFunctionEffect(DatabaseService, (_) => _.initializeTables)()
    ),
    Effect.map(() => getSchedule()),
    Effect.flatMap(Stream.runCollect),
    Effect.map((matches) => {
      const groupedMatches: Record<IsoDate, CoreData.Match[]> = {};

      Chunk.forEach(matches, (match) => {
        const matchDate = new Date(match.date);
        const matchDay = new Date(
          matchDate.getFullYear(),
          matchDate.getMonth(),
          matchDate.getDate()
        );
        const matchDayIso = matchDay.toISOString() as IsoDate;

        if (!groupedMatches[matchDayIso]) {
          groupedMatches[matchDayIso] = [];
        }

        const matchIndex = groupedMatches[matchDayIso].findIndex((m) => m.id === match.id);
        if (matchIndex === -1) {
          groupedMatches[matchDayIso].push(match);
        } else {
          groupedMatches[matchDayIso][matchIndex] = match;
        }
      });

      return groupedMatches;
    }),
    Effect.map((groupedMatches) => JSON.stringify(groupedMatches, null, 2)),
    Effect.flatMap((json) => Effect.promise(() => fs.writeFile(jsonDumpPath, json))),
    Effect.provide(getMainLayer())
  );

const getMainLayer = () =>
  Layer.empty.pipe(
    Layer.merge(LeagueOfLegendsApiServiceImpl),
    Layer.merge(OctaneApiServiceImpl),
    Layer.merge(KarmineApiServiceImpl),
    Layer.merge(StrafeApiServiceImpl),
    Layer.merge(VlrGgApiServiceImpl),
    Layer.merge(FetchServiceImpl),
    Layer.merge(createBetterSqlite3WithDrizzleImpl(databaseDumpPath)),
    Layer.merge(createEnvServiceImpl({ firebaseEnvShouldBeDefined: false })),
    Layer.merge(
      createGetScheduleParamsStateImpl({
        dateRange: {
          // We don't want to dump the current day and the future. We only want to dump the past.
          end: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        },
      })
    )
  );

Effect.runPromise(createDump())
  .then(() => console.log(`Dump created at ${dumpPath}`))
  .catch((error) => {
    console.error('Error creating dump', error);
    process.exit(1);
  });
