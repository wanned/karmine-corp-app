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
          away: z.object({
            name: z.string(),
          }),
          home: z.object({
            name: z.string(),
          }),
          start_date: z.coerce.date(),
        })
      )
      .optional()
  ),
});
