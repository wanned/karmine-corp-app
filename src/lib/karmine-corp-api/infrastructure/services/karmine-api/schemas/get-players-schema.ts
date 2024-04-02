import * as v from '@badrap/valita';

export const getPlayersSchema = v.array(
  v.object({
    twitch_identifier: v.string(),
    twitch_login: v.string(),
    friendly_name: v.string(),
    twitch_picture: v.string(),
    category_game: v.string(),
  })
);
