// The leagues come from the League of Legends API
// https://esports-api.lolesports.com/persisted/gw/getLeagues?hl=en-US

import { CoreData } from '../../types/core-data';

// They correspond to the leagues Karmine Corp is or could be playing in
export const karmineCorpLeagues = [
  {
    leagueId: '105266103462388553',
    slug: 'lfl',
    team: CoreData.CompetitionName.LeagueOfLegendsLFL,
  },
  {
    leagueId: '100695891328981122',
    slug: 'emea_masters',
    team: CoreData.CompetitionName.LeagueOfLegendsLFL,
  },
  { leagueId: '98767991302996019', slug: 'lec', team: CoreData.CompetitionName.LeagueOfLegendsLEC },
  {
    leagueId: '110988878756156222',
    slug: 'wqs',
    team: CoreData.CompetitionName.LeagueOfLegendsLEC,
  },
  { leagueId: '98767991325878492', slug: 'msi', team: CoreData.CompetitionName.LeagueOfLegendsLEC },
  {
    leagueId: '98767975604431411',
    slug: 'worlds',
    team: CoreData.CompetitionName.LeagueOfLegendsLEC,
  },
] as const;
