import * as v from '@badrap/valita';

import { vDateString } from '../../../utils/valita-types/date-string';

const teamSchema = v.object({
  name: v.string(),
  code: v.string(),
  image: v.string(),
  result: v
    .object({
      outcome: v.union(v.literal('win'), v.literal('loss')).nullable(),
      gameWins: v.number(),
    })
    .nullable(),
});

export const getScheduleByLeagueIdsSchema = v.object({
  data: v.object({
    schedule: v.object({
      pages: v.object({
        older: v.string().nullable().optional(),
        newer: v.string().nullable().optional(),
      }),
      events: v
        .array(
          v.union(
            v.object({
              type: v.literal('match'),
              startTime: vDateString,
              state: v.union(
                v.literal('unstarted'),
                v.literal('inProgress'),
                v.literal('completed')
              ),
              league: v.object({
                slug: v.string(),
              }),
              match: v.object({
                id: v.string(),
                teams: v.tuple([teamSchema, teamSchema]),
                strategy: v.object({
                  type: v.literal('bestOf'),
                  count: v.number(),
                }),
              }),
            }),
            v.unknown().chain(() => v.ok(undefined))
          )
        )
        .chain((data) =>
          v.ok(data.filter((d): d is NonNullable<typeof d> => d !== null && d !== undefined))
        ),
    }),
  }),
});
