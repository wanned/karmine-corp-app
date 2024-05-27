import * as v from '@badrap/valita';

import { vlrGgApiSchemas } from './schemas/vlr-gg-api-schemas';

export namespace VlrGgApi {
  export interface GetMatches {
    html: string;
  }

  export interface GetMatch {
    data: Record<string, unknown>;
  }

  export interface GetPlayer extends v.Infer<typeof vlrGgApiSchemas.getPlayer> {}
}
