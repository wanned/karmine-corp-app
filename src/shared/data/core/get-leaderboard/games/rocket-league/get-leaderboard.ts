import { getCurrentSeason } from './get-current-season';
import { getLeaderboardForSeason } from './get-leaderboard-for-season';
import { DataFetcher } from '../../../data-fetcher';

import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';

export async function getLeaderboard({
  apis,
  onResult,
}: DataFetcher.GetLeaderboardParams): Promise<CoreData.Leaderboards> {
  const currentSeason = await getCurrentSeason({ apis });

  if (!currentSeason) {
    return {};
  }

  return getLeaderboardForSeason({ apis, onResult }, currentSeason);
}
