import * as v from '@badrap/valita';

const teamGameSchema = v.object({
  id: v.string(),
  side: v.union(v.literal('blue'), v.literal('red')),
});

const teamSchema = v.object({
  id: v.string(),
  name: v.string(),
  result: v.object({
    gameWins: v.number(),
  }),
});

export const getMatchByIdSchema = v.object({
  data: v.object({
    event: v.object({
      type: v.literal('match'),
      match: v.object({
        teams: v.tuple([teamSchema, teamSchema]),
        games: v.array(
          v.object({
            number: v.number(),
            id: v.string(),
            teams: v.array(teamGameSchema),
          })
        ),
      }),
    }),
  }),
});
