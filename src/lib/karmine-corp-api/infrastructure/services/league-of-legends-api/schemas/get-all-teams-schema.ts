import * as v from '@badrap/valita';

export const getAllTeamsSchema = v.object({
  data: v.object({
    teams: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        image: v.string(),
        players: v.array(
          v.object({
            id: v.string(),
            image: v.string(),
          })
        ),
      })
    ),
  }),
});
