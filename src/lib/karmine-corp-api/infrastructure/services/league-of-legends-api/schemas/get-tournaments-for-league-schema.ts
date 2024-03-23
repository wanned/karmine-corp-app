import { z } from 'zod';

export const getTournamentsForLeagueSchema = z.object({
  data: z.object({
    leagues: z.array(
      z.object({
        tournaments: z.array(
          z.object({
            id: z.string(),
            slug: z.string(),
            startDate: z.coerce.date(),
            endDate: z.coerce.date(),
          })
        ),
      })
    ),
  }),
});
