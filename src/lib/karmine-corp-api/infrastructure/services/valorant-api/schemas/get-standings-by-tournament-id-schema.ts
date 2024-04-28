import * as v from '@badrap/valita';
import { vDateString } from '../../../utils/valita-types/date-string';

const bracketSchema = v.object({
  type: v.literal('bracket'),
  columns: v.array(
    v.object({
      cells: v.array(
        v.object({
          matches: v.array(
            v.object({
              id: v.string(),
              teams: v.array(
                v.object({
                  id: v.string(),
                  name: v.string(),
                  image: v.string(),
                  result: v
                    .object({
                      outcome: v.union(v.literal('win'), v.literal('loss')).nullable(),
                    })
                    .nullable(),
                  origin: v.object({
                    type: v.string(),
                    structuralId: v.string(),
                  }),
                })
              ),
              structuralId: v.string(),
            })
          ),
        })
      ),
    })
  ),
});

const groupSchema = v.object({
  type: v.literal('group'),
  rankings: v.array(
    v.object({
      ordinal: v.number(),
      teams: v.array(
        v.object({
          id: v.string(),
          name: v.string(),
          image: v.string(),
          record: v.object({ wins: v.number(), losses: v.number() }),
        })
      ),
    })
  ),
});

const crossGroupSchema = v.object({
  type: v.literal('crossGroup'),
  rankings: v.array(
    v.object({
      ordinal: v.number(),
      teams: v.array(
        v.object({
          id: v.string(),
          name: v.string(),
          image: v.string(),
          record: v.object({ wins: v.number(), losses: v.number() }),
        })
      ),
    })
  ),
});

export const getStandingsByTournamentIdSchema = v.object({
  data: v.object({
    standings: v.array(
      v.object({
        season: v.object({
          startTime: vDateString,
          endTime: vDateString,
          splits: v.array(
            v.object({
              id: v.string(),
              startTime: vDateString,
              endTime: vDateString,
            })
          ),
        }),
        split: v.object({
          id: v.string(),
        }),
        stages: v.array(
          v.object({
            sections: v.array(v.union(bracketSchema, groupSchema, crossGroupSchema)),
          })
        ),
      })
    ),
  }),
});
