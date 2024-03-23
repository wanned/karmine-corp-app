import { z } from 'zod';

import { karmineApiSchemas } from './schemas/karmine-api-schemas';

export namespace KarmineApi {
  export interface GetEvents extends z.infer<typeof karmineApiSchemas.getEvents> {}

  export interface GetEventsResults extends z.infer<typeof karmineApiSchemas.getEventsResults> {}

  export interface GetPlayers extends z.infer<typeof karmineApiSchemas.getPlayers> {}

  export interface GetTwitch extends z.infer<typeof karmineApiSchemas.getTwitch> {}

  export interface GetGames extends z.infer<typeof karmineApiSchemas.getGames> {}
}
