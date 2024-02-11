import { getCurrentTournamentId } from './get-current-tournament-id';
import { DataFetcher } from '../../../data-fetcher';
import { getLeaguesForTeam } from '../../../get-schedule/games/league-of-legends/get-lol-leagues';
import { CoreData } from '../../../types';
import { parseLeaderboard } from '../../utils/parse-leaderboard';

export async function getLeaderboardForTeam(
  { apis, onResult }: DataFetcher.GetLeaderboardParams,
  team: CoreData.CompetitionName.LeagueOfLegendsLEC | CoreData.CompetitionName.LeagueOfLegendsLFL
): Promise<CoreData.LeaderboardItem[]> {
  const leagues = await getLeaguesForTeam(team);
  const currentTournamentId = await getCurrentTournamentId(
    { apis, onResult },
    { leagueIds: leagues.map(({ id }) => id) }
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
