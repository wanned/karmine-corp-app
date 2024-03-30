import { Layer } from 'effect';

import { createOpSqliteImpl } from '~/lib/karmine-corp-api/infrastructure/services/database/op-sqlite-impl';
import { EnvRnServiceImpl } from '~/lib/karmine-corp-api/infrastructure/services/env/env-rn-service-impl';
import { FetchServiceImpl } from '~/lib/karmine-corp-api/infrastructure/services/fetch/fetch-service-impl';
import { KarmineApiServiceImpl } from '~/lib/karmine-corp-api/infrastructure/services/karmine-api/karmine-api-service-impl';
import { LeagueOfLegendsApiServiceImpl } from '~/lib/karmine-corp-api/infrastructure/services/league-of-legends-api/league-of-legends-api-service-impl';
import { LiquipediaParseApiServiceImpl } from '~/lib/karmine-corp-api/infrastructure/services/liquipedia-parse-api/liquipedia-parse-api-service-impl';
import { OctaneApiServiceImpl } from '~/lib/karmine-corp-api/infrastructure/services/octane-api/octane-api-service-impl';
import { StrafeApiServiceImpl } from '~/lib/karmine-corp-api/infrastructure/services/strafe-api/strafe-api-service-impl';

export const mainLayer = Layer.empty.pipe(
  Layer.merge(LeagueOfLegendsApiServiceImpl),
  Layer.merge(OctaneApiServiceImpl),
  Layer.merge(KarmineApiServiceImpl),
  Layer.merge(StrafeApiServiceImpl),
  Layer.merge(LiquipediaParseApiServiceImpl),
  Layer.merge(FetchServiceImpl),
  Layer.merge(createOpSqliteImpl('karmine-corp-api')),
  Layer.merge(EnvRnServiceImpl)
);
