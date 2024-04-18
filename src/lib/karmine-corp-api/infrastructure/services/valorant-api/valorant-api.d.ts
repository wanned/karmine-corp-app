import * as v from '@badrap/valita';

import { valorantApiSchemas } from './schemas/valorant-api-schemas';

export namespace ValorantApi {
  export interface GetAllLeagues extends v.Infer<typeof valorantApiSchemas.getAllLeagues> {}

  export interface GetStandingsByTournamentId
    extends v.Infer<typeof valorantApiSchemas.getStandingsByTournamentId> {}
}
