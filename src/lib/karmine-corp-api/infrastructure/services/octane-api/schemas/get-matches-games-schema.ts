import * as v from '@badrap/valita';

const teamDetailsInGameSchema = v.object({
  team: v.object({
    stats: v
      .object({
        core: v.object({
          goals: v.number(),
          saves: v.number(),
          score: v.number(),
        }),
      })
      .optional(),
  }),
});

export const getMatchesGamesSchema = v.object({
  games: v.array(
    v.object({
      _id: v.string(),
      number: v.number(),
      blue: teamDetailsInGameSchema,
      orange: teamDetailsInGameSchema,
    })
  ),
});
