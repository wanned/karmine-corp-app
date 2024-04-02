import * as v from '@badrap/valita';

import { karmineApiSchemas } from './schemas/karmine-api-schemas';

export namespace KarmineApi {
  export interface GetEvents extends v.Infer<typeof karmineApiSchemas.getEvents> {}

  export interface GetEventsResults extends v.Infer<typeof karmineApiSchemas.getEventsResults> {}

  export interface GetPlayers extends v.Infer<typeof karmineApiSchemas.getPlayers> {}

  export interface GetTwitch extends v.Infer<typeof karmineApiSchemas.getTwitch> {}

  export interface GetGames extends v.Infer<typeof karmineApiSchemas.getGames> {}
}
