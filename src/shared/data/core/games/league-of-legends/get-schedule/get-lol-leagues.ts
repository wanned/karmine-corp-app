import { CoreData } from '../../../types';

const CompetitionName = CoreData.CompetitionName;

// The leagues come from the League of Legends API
// https://esports-api.lolesports.com/persisted/gw/getLeagues?hl=en-US
// They correspond to the leagues Karmine Corp is or could be playing in
const LOL_LEAGUES = [
  { id: '105266103462388553', slug: 'lfl', team: CompetitionName.LeagueOfLegendsLFL },
  { id: '100695891328981122', slug: 'emea_masters', team: CompetitionName.LeagueOfLegendsLFL },
  { id: '98767991302996019', slug: 'lec', team: CompetitionName.LeagueOfLegendsLEC },
  { id: '110988878756156222', slug: 'wqs', team: CompetitionName.LeagueOfLegendsLEC },
  { id: '98767991325878492', slug: 'msi', team: CompetitionName.LeagueOfLegendsLEC },
  { id: '98767975604431411', slug: 'worlds', team: CompetitionName.LeagueOfLegendsLEC },
] as const;

export const findLeague = async (params: { id: string } | { slug: string }) =>
  'id' in params ?
    LOL_LEAGUES.find(({ id }) => id === params.id)
  : LOL_LEAGUES.find(({ slug }) => slug === params.slug);

export const getAllLeagues = () => Promise.resolve(LOL_LEAGUES);
