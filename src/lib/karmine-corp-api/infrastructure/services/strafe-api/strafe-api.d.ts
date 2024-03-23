import { z } from 'zod';

import { strafeApiSchemas } from './schemas/strafe-api-schemas';

export namespace StrafeApi {
  export interface GetCalendar extends z.infer<typeof strafeApiSchemas.getCalendar> {}

  export interface GetMatch extends z.infer<typeof strafeApiSchemas.getMatch> {}
}
