import * as v from '@badrap/valita';

import { liquipediaApiSchemas } from './schemas/liquipedia-api-schemas';

export namespace LiquipediaParseApi {
  export interface Parse extends v.Infer<typeof liquipediaApiSchemas.parse> {}
}
