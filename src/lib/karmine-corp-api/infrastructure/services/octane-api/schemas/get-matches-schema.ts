import * as v from '@badrap/valita';

import { vDateString } from '../../../utils/valita-types/date-string';

const teamDetailsInMatchSchema = v.object({
  score: v.number().default(0),
  winner: v.boolean().default(false),
  team: v.object({
    team: v.object({
      _id: v.string(),
      name: v.string(),
      image: v.string().optional(),
    }),
  }),
  players: v
    .array(
      v.object({
        player: v.object({
          _id: v.string(),
          tag: v.string(),
        }),
      })
    )
    .default([]),
});

export const getMatchesSchema = v.object({
  matches: v.array(
    v.object({
      _id: v.string(),
      date: vDateString,
      format: v.object({
        type: v.literal('best'),
        length: v.number(),
      }),
      blue: teamDetailsInMatchSchema,
      orange: teamDetailsInMatchSchema,
    })
  ),
  page: v.number(),
  perPage: v.number(),
  pageSize: v.number(),
});
