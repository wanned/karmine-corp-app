import * as v from '@badrap/valita';

import { leagueOfLegendsApiSchemas } from './schemas/league-of-legends-api-schemas';

export namespace LeagueOfLegendsApi {
  export interface GetMatch extends v.Infer<typeof leagueOfLegendsApiSchemas.getMatchById> {}

  export interface GetTeams extends v.Infer<typeof leagueOfLegendsApiSchemas.getAllTeams> {}

  export interface GetSchedule
    extends v.Infer<typeof leagueOfLegendsApiSchemas.getScheduleByLeagueIds> {}

  export type GetGameWindow = v.Infer<typeof leagueOfLegendsApiSchemas.getGameWindow>;

  export interface GetVersions extends v.Infer<typeof leagueOfLegendsApiSchemas.getAllVersions> {}

  export interface GetTournaments
    extends v.Infer<typeof leagueOfLegendsApiSchemas.getTournamentsForLeague> {}

  export interface GetStandings
    extends v.Infer<typeof leagueOfLegendsApiSchemas.getStandingsByTournamentId> {}
}
