import * as v from '@badrap/valita';

import { vDateString } from '../../../utils/valita-types/date-string';

export const getCalendarSchema = v.object({
  data: v
    .array(
      v.union(
        v.object({
          game: v.literal(2),
          id: v.number(),
          away: v
            .object({
              name: v.string(),
            })
            .nullable(),
          home: v
            .object({
              name: v.string(),
            })
            .nullable(),
          start_date: vDateString,
        }),
        v.unknown().chain(() => v.ok(undefined))
      )
    )
    .chain((data) =>
      v.ok(data.filter((d): d is NonNullable<typeof d> => d !== null && d !== undefined))
    )
    .optional(),
});
