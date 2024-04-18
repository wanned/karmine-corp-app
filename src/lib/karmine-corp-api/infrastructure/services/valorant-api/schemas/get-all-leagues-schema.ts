import * as v from '@badrap/valita';

import { vDateString } from '../../../utils/valita-types/date-string';

export const getAllLeaguesSchema = v.object({
  data: v.object({
    leagues: v.array(
      v.object({
        id: v.string(),
        slug: v.string(),
        tournaments: v.array(
          v.object({
            id: v.string(),
            season: v
              .object({
                id: v.string(),
                startTime: vDateString,
              })
              .nullable(),
          })
        ),
      })
    ),
  }),
});
