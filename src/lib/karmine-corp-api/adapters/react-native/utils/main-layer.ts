import { Layer } from 'effect';

import { createOpSqliteWithDumpImpl } from '~/lib/karmine-corp-api/infrastructure/services/database/op-sqlite-with-dump-impl';
import { EnvRnServiceImpl } from '~/lib/karmine-corp-api/infrastructure/services/env/env-rn-service-impl';
import { FetchServiceImpl } from '~/lib/karmine-corp-api/infrastructure/services/fetch/fetch-service-impl';
import { KarmineApiServiceImpl } from '~/lib/karmine-corp-api/infrastructure/services/karmine-api/karmine-api-service-impl';
import { LeagueOfLegendsApiServiceImpl } from '~/lib/karmine-corp-api/infrastructure/services/league-of-legends-api/league-of-legends-api-service-impl';
import { LiquipediaParseApiServiceImpl } from '~/lib/karmine-corp-api/infrastructure/services/liquipedia-parse-api/liquipedia-parse-api-service-impl';
import { OctaneApiServiceImpl } from '~/lib/karmine-corp-api/infrastructure/services/octane-api/octane-api-service-impl';
import { StrafeApiServiceImpl } from '~/lib/karmine-corp-api/infrastructure/services/strafe-api/strafe-api-service-impl';
import { ValorantApiServiceImpl } from '~/lib/karmine-corp-api/infrastructure/services/valorant-api/valorant-api-impl';
import { VlrGgApiServiceImpl } from '~/lib/karmine-corp-api/infrastructure/services/vlr-gg-api/vlr-gg-api-service-impl';

export const mainLayer = Layer.empty.pipe(
  Layer.merge(LeagueOfLegendsApiServiceImpl),
  Layer.merge(OctaneApiServiceImpl),
  Layer.merge(KarmineApiServiceImpl),
  Layer.merge(StrafeApiServiceImpl),
  Layer.merge(LiquipediaParseApiServiceImpl),
  Layer.merge(VlrGgApiServiceImpl),
  Layer.merge(ValorantApiServiceImpl),
  Layer.merge(FetchServiceImpl),
  Layer.merge(createOpSqliteWithDumpImpl('/assets/matches-dump.db')),
  Layer.merge(EnvRnServiceImpl)
);
