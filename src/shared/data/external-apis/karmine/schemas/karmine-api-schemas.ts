import { getGamesSchema } from './get-games-schema';
import { getPlayersSchema } from './get-players-schema';
import { getTwitchSchema } from './get-twitch-schema';

export const karmineApiSchemas = {
  getPlayers: getPlayersSchema,
  getTwitch: getTwitchSchema,
  getGames: getGamesSchema,
};
