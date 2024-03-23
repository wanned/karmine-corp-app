import { getCurrentTournamentId } from './get-current-tournament-id';
import { DataFetcher } from '../../../data-fetcher';
import { parseLeaderboard } from '../../utils/parse-leaderboard';

import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';

// The leagues come from the League of Legends API
// https://esports-api.lolesports.com/persisted/gw/getLeagues?hl=en-US
// They correspond to the leagues Karmine Corp is or could be playing in
const LOL_LEAGUES = [
  { id: '105266103462388553', slug: 'lfl', team: CoreData.CompetitionName.LeagueOfLegendsLFL },
  {
    id: '100695891328981122',
    slug: 'emea_masters',
    team: CoreData.CompetitionName.LeagueOfLegendsLFL,
  },
  { id: '98767991302996019', slug: 'lec', team: CoreData.CompetitionName.LeagueOfLegendsLEC },
  { id: '110988878756156222', slug: 'wqs', team: CoreData.CompetitionName.LeagueOfLegendsLEC },
  { id: '98767991325878492', slug: 'msi', team: CoreData.CompetitionName.LeagueOfLegendsLEC },
  { id: '98767975604431411', slug: 'worlds', team: CoreData.CompetitionName.LeagueOfLegendsLEC },
] as const;

export async function getLeaderboardForTeam(
  { apis, onResult }: DataFetcher.GetLeaderboardParams,
  team: CoreData.CompetitionName.LeagueOfLegendsLEC | CoreData.CompetitionName.LeagueOfLegendsLFL
): Promise<CoreData.LeaderboardItem[]> {
  const currentTournamentId = await getCurrentTournamentId(
    { apis, onResult },
    { leagueIds: LOL_LEAGUES.map(({ id }) => id) }
  );

  const standings = await apis.lolEsport.getStandingsByTournamentId(currentTournamentId);

  const leaderboard = parseLeaderboard(standings);

  const coreLeaderboard = await getCoreLeaderboard({ apis, onResult }, leaderboard);
  onResult({ [team]: coreLeaderboard });

  return coreLeaderboard;
}

async function getCoreLeaderboard(
  { apis }: DataFetcher.GetLeaderboardParams,
  leaderboard: ReturnType<typeof parseLeaderboard>
): Promise<CoreData.LeaderboardItem[]> {
  const teams = await apis.lolEsport.getAllTeams();
  return Object.values(leaderboard).map((leaderboardItem) => {
    const team = teams.find(({ id }) => id === leaderboardItem.teamId);

    return {
      ...leaderboardItem,
      logoUrl: team?.image ?? '',
    };
  });
}
