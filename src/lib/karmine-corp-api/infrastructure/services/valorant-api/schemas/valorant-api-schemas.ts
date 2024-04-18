import { getAllLeaguesSchema } from './get-all-leagues-schema';
import { getStandingsByTournamentIdSchema } from './get-standings-by-tournament-id-schema';

export const valorantApiSchemas = {
  getAllLeagues: getAllLeaguesSchema,
  getStandingsByTournamentId: getStandingsByTournamentIdSchema,
};
