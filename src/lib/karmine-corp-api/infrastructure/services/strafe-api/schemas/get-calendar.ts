import { z } from 'zod';

export const getCalendarSchema = z.object({
  data: z.preprocess(
    (data: any) => {
      return Array.isArray(data) ? data.filter((match: any) => match.game === 2) : [];
    },
    z
      .array(
        z.object({
          id: z.number(),
          away: z
            .object({
              name: z.string(),
            })
            .nullable(),
          home: z
            .object({
              name: z.string(),
            })
            .nullable(),
          start_date: z.coerce.date(),
        })
      )
      .optional()
  ),
});
