import { z } from 'zod';

const teamGameSchema = z.object({
  id: z.string(),
  side: z.enum(['blue', 'red']),
});

export const getMatchByIdSchema = z.object({
  data: z.object({
    event: z.object({
      type: z.literal('match'),
      match: z.object({
        games: z.array(
          z.object({
            number: z.number().int(),
            id: z.string(),
            teams: z.array(teamGameSchema),
          })
        ),
      }),
    }),
  }),
});
