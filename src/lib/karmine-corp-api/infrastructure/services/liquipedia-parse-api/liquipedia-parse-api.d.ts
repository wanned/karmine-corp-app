import { z } from 'zod';

import { liquipediaApiSchemas } from './schemas/liquipedia-api-schemas';

export namespace LiquipediaParseApi {
  export interface Parse extends z.infer<typeof liquipediaApiSchemas.parse> {}
}
