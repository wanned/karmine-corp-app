import { getAllTeamsSchema } from './get-all-teams-schema';
import { getAllVersionsSchema } from './get-all-versions-schema';
import { getGameWindowSchema } from './get-game-window-schema';
import { getMatchByIdSchema } from './get-match-details-by-id-schema';
import { getScheduleByLeagueIdsSchema } from './get-schedule-by-league-ids-schema';
import { getStandingsByTournamentIdSchema } from './get-standings-by-tournament-id-schema';
import { getTournamentsForLeagueSchema } from './get-tournaments-for-league-schema';

export const lolEsportApiSchemas = {
  getMatchById: getMatchByIdSchema,
  getAllTeams: getAllTeamsSchema,
  getGameWindow: getGameWindowSchema,
  getScheduleByLeagueIds: getScheduleByLeagueIdsSchema,
  getAllVersions: getAllVersionsSchema,
  getTournamentsForLeague: getTournamentsForLeagueSchema,
  getStandingsByTournamentId: getStandingsByTournamentIdSchema,
};
