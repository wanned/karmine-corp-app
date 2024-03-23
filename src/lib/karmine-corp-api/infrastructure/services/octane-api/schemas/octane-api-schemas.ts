import { getMatchesGamesSchema } from './get-matches-games-schema';
import { getMatchesSchema } from './get-matches-schema';

export const octaneApiSchemas = {
  getMatches: getMatchesSchema,
  getMatchGames: getMatchesGamesSchema,
};
