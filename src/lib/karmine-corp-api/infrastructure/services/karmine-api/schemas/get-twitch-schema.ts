import * as v from '@badrap/valita';

import { vDateString } from '../../../utils/valita-types/date-string';

export const getTwitchSchema = v.array(
  v.object({
    twitch_identifier: v.string(),
    twitch_login: v.string(),
    friendly_name: v.string(),
    category_game: v.string(),
    sub_category_game: v.string().nullable(),
    twitch_title: v.string(),
    twitch_picture: v.string(),
    twitch_game: v.string(),
    twitch_uptime: vDateString,
    twitch_viewers: v.number(),
    thumbnail: v.string(),
  })
);
