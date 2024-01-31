import { z } from 'zod';

const teamSchema = z.object({
  name: z.string(),
  code: z.string(),
  image: z.string().url(),
  result: z
    .object({
      outcome: z.enum(['win', 'loss']).nullable(),
      gameWins: z.number().int(),
    })
    .nullable(),
});

export const getScheduleByLeagueIdsSchema = z.object({
  data: z.object({
    schedule: z.object({
      pages: z.object({
        older: z.string().nullable().optional(),
        newer: z.string().nullable().optional(),
      }),
      events: z.preprocess(
        (data: any) => {
          return Array.isArray(data) ? data.filter((d: any) => d.type === 'match') : [];
        },
        z.array(
          z.object({
            startTime: z.coerce.date(),
            state: z.enum(['unstarted', 'inProgress', 'completed']),
            league: z.object({
              slug: z.string(),
            }),
            match: z.object({
              id: z.string(),
              teams: z.tuple([teamSchema, teamSchema]),
              strategy: z.object({
                type: z.literal('bestOf'),
                count: z.number().int(),
              }),
            }),
          })
        )
      ),
    }),
  }),
});
