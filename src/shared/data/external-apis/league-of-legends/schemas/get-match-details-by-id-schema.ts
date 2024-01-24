import { z } from 'zod';

export const getMatchByIdSchema = z.object({
  data: z.object({
    event: z.object({
      type: z.literal('match'),
      match: z.object({
        games: z.array(
          z.object({
            number: z.number().int(),
            id: z.string(),
          })
        ),
      }),
    }),
  }),
});
