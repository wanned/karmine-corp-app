import { z } from 'zod';

const bracketSchema = z.object({
  type: z.literal('bracket'),
  columns: z.array(
    z.object({
      cells: z.array(
        z.object({
          matches: z.array(
            z.object({
              id: z.string(),
              teams: z.array(
                z.object({
                  id: z.string(),
                  name: z.string(),
                  result: z
                    .object({
                      outcome: z.union([z.literal('win'), z.literal('loss'), z.null()]),
                    })
                    .nullable(),
                  origin: z.object({
                    type: z.string(),
                    structuralId: z.string(),
                  }),
                })
              ),
              structuralId: z.string(),
            })
          ),
        })
      ),
    })
  ),
});

const groupSchema = z.object({
  type: z.literal('group'),
  rankings: z.array(
    z.object({
      ordinal: z.number(),
      teams: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          record: z.object({ wins: z.number(), losses: z.number() }),
        })
      ),
    })
  ),
});

export const getStandingsByTournamentIdSchema = z.object({
  data: z.object({
    standings: z.array(
      z.object({
        stages: z.array(
          z.object({
            sections: z.array(z.union([bracketSchema, groupSchema])),
          })
        ),
      })
    ),
  }),
});
