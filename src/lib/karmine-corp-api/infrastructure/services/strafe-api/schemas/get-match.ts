import { z } from 'zod';

export const getMatchSchema = z.object({
  data: z.object({
    live: z.preprocess(
      (data: any) => {
        return Array.isArray(data) ? data.filter((d: any) => d.key === 'game-lol') : [];
      },
      z.array(
        z.object({
          data: z.object({
            status: z.enum(['live', 'finished']),
            index: z.number().int(),
            winner: z.enum(['home', 'away']).nullable(),
            game: z.object({
              duration: z.number().int(),
            }),
          }),
        })
      )
    ),
  }),
});
