import * as v from '@badrap/valita';

import { strafeApiSchemas } from './schemas/strafe-api-schemas';

export namespace StrafeApi {
  export interface GetCalendar extends v.Infer<typeof strafeApiSchemas.getCalendar> {}

  export interface GetMatch extends v.Infer<typeof strafeApiSchemas.getMatch> {}
}
