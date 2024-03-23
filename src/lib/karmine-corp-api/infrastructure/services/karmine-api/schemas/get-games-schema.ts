import { z } from 'zod';

export const getGamesSchema = z.array(
  z.object({
    game_name: z.string(),
    game_name_friendly: z.string(),
    game_picture: z.string().url(),
  })
);
