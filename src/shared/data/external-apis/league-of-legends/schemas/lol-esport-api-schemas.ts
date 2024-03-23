import { getAllTeamsSchema } from './get-all-teams-schema';
import { getStandingsByTournamentIdSchema } from './get-standings-by-tournament-id-schema';
import { getTournamentsForLeagueSchema } from './get-tournaments-for-league-schema';

export const lolEsportApiSchemas = {
  getAllTeams: getAllTeamsSchema,
  getTournamentsForLeague: getTournamentsForLeagueSchema,
  getStandingsByTournamentId: getStandingsByTournamentIdSchema,
};
