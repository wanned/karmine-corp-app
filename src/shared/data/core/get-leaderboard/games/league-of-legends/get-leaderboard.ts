import { getLeaderboardForTeam } from './get-leaderboard-for-team';
import { DataFetcher } from '../../../data-fetcher';
import { CoreData } from '../../../types';

export async function getLeaderboard({
  apis,
  onResult,
}: DataFetcher.GetLeaderboardParams): Promise<CoreData.Leaderboards> {
  return Promise.all([
    getLeaderboardForTeam({ apis, onResult }, CoreData.CompetitionName.LeagueOfLegendsLEC),
    getLeaderboardForTeam({ apis, onResult }, CoreData.CompetitionName.LeagueOfLegendsLFL),
  ]).then(([LeagueOfLegendsLEC, LeagueOfLegendsLFL]) => ({
    [CoreData.CompetitionName.LeagueOfLegendsLEC]: LeagueOfLegendsLEC,
    [CoreData.CompetitionName.LeagueOfLegendsLFL]: LeagueOfLegendsLFL,
  }));
}
