import { z } from 'zod';

export const getPlayersSchema = z.array(
  z.object({
    twitch_identifier: z.string(),
    twitch_login: z.string(),
    friendly_name: z.string(),
    twitch_picture: z.string().url(),
    category_game: z.string(),
  })
);
