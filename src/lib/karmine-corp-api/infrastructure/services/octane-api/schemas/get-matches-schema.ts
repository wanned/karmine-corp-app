import { z } from 'zod';

const teamDetailsInMatchSchema = z.object({
  score: z.number().default(0),
  winner: z.boolean().default(false),
  team: z.object({
    team: z.object({
      _id: z.string(),
      name: z.string(),
      image: z.string().url().optional(),
    }),
  }),
  players: z
    .array(
      z.object({
        player: z.object({
          _id: z.string(),
          tag: z.string(),
        }),
      })
    )
    .default([]),
});

export const getMatchesSchema = z.object({
  matches: z.array(
    z.object({
      _id: z.string(),
      date: z.coerce.date(),
      format: z.object({
        type: z.literal('best'),
        length: z.number(),
      }),
      blue: teamDetailsInMatchSchema,
      orange: teamDetailsInMatchSchema,
    })
  ),
  page: z.number(),
  perPage: z.number(),
  pageSize: z.number(),
});
