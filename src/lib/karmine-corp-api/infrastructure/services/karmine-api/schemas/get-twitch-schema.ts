import { z } from 'zod';

export const getTwitchSchema = z.array(
  z.object({
    twitch_identifier: z.string(),
    twitch_login: z.string(),
    friendly_name: z.string(),
    category_game: z.string(),
    sub_category_game: z.string().nullable(),
    twitch_title: z.string(),
    twitch_picture: z.string().url(),
    twitch_game: z.string(),
    twitch_uptime: z.coerce.date(),
    twitch_viewers: z.number(),
    thumbnail: z.string(),
  })
);
