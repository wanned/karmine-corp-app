import * as v from '@badrap/valita';

import { vDateString } from '../../../utils/valita-types/date-string';

export const getTournamentsForLeagueSchema = v.object({
  data: v.object({
    leagues: v.array(
      v.object({
        tournaments: v.array(
          v.object({
            id: v.string(),
            slug: v.string(),
            startDate: vDateString,
            endDate: vDateString,
          })
        ),
      })
    ),
  }),
});
