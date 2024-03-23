import { z } from 'zod';

import { octaneApiSchemas } from './schemas/octane-api-schemas';

export namespace OctaneApi {
  export interface GetMatches extends z.infer<typeof octaneApiSchemas.getMatches> {}

  export interface GetMatchGames extends z.infer<typeof octaneApiSchemas.getMatchGames> {}
}
