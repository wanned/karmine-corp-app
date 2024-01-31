import { z } from 'zod';

export const getAllTeamsSchema = z.object({
  data: z.object({
    teams: z.array(
      z.object({
        players: z.array(
          z.object({
            id: z.string(),
            image: z.string().url(),
          })
        ),
      })
    ),
  }),
});
