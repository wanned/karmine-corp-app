import * as v from '@badrap/valita';

import { octaneApiSchemas } from './schemas/octane-api-schemas';

export namespace OctaneApi {
  export interface GetMatches extends v.Infer<typeof octaneApiSchemas.getMatches> {}

  export interface GetMatchGames extends v.Infer<typeof octaneApiSchemas.getMatchGames> {}
}
