import Database from 'better-sqlite3';
import { Effect, Layer, Stream } from 'effect';
import path from 'node:path';
import process from 'node:process';

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

export const createDump = (dumpPath: string) =>
  Effect.Do.pipe(
    Effect.flatMap(() =>
      Effect.serviceFunctionEffect(DatabaseService, (_) => _.initializeTables)()
    ),
    Effect.map(() => getSchedule()),
    Effect.flatMap(Stream.runDrain),
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
    Layer.merge(createBetterSqlite3WithDrizzleImpl(dumpPath)),
    Layer.merge(createEnvServiceImpl({ firebaseEnvShouldBeDefined: false })),
    Layer.merge(createGetScheduleParamsStateImpl({}))
  );

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

const realDumpPath = path.join(process.cwd(), dumpPath);

Effect.runPromise(createDump(realDumpPath))
  .then(() => console.log(`Dump created at ${dumpPath}`))
  .catch((error) => {
    console.error('Error creating dump', error);
    process.exit(1);
  });
