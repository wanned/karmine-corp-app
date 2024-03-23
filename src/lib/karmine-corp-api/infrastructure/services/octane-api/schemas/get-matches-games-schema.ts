import { z } from 'zod';

const teamDetailsInGameSchema = z.object({
  team: z.object({
    stats: z
      .object({
        core: z.object({
          goals: z.number(),
          saves: z.number(),
          score: z.number(),
        }),
      })
      .optional(),
  }),
});

export const getMatchesGamesSchema = z.object({
  games: z.array(
    z.object({
      _id: z.string(),
      number: z.number(),
      blue: teamDetailsInGameSchema,
      orange: teamDetailsInGameSchema,
    })
  ),
});
