import { z } from 'zod';

import { leagueOfLegendsApiSchemas } from './schemas/league-of-legends-api-schemas';

export namespace LeagueOfLegendsApi {
  export interface GetMatch extends z.infer<typeof leagueOfLegendsApiSchemas.getMatchById> {}

  export interface GetTeams extends z.infer<typeof leagueOfLegendsApiSchemas.getAllTeams> {}

  export interface GetSchedule
    extends z.infer<typeof leagueOfLegendsApiSchemas.getScheduleByLeagueIds> {}

  export type GetGameWindow = z.infer<typeof leagueOfLegendsApiSchemas.getGameWindow>;

  export interface GetVersions extends z.infer<typeof leagueOfLegendsApiSchemas.getAllVersions> {}

  export interface GetTournaments
    extends z.infer<typeof leagueOfLegendsApiSchemas.getTournamentsForLeague> {}

  export interface GetStandings
    extends z.infer<typeof leagueOfLegendsApiSchemas.getStandingsByTournamentId> {}
}
