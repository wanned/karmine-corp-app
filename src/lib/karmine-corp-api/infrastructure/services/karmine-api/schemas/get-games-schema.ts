import * as v from '@badrap/valita';

export const getGamesSchema = v.array(
  v.object({
    game_name: v.string(),
    game_name_friendly: v.string(),
    game_picture: v.string(),
  })
);
