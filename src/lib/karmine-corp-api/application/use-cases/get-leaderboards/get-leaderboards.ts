import defu from 'defu';
import { Effect } from 'effect';

import { getLeagueOfLegendsLeaderboards } from '../../services/get-league-of-leagends-leaderboards/get-league-of-legends-leaderboards';
import { getRocketLeagueLeaderboard } from '../../services/get-rocket-league-leaderboard/get-rocket-league-leaderboard';
import { getValorantLeaderboards } from '../../services/get-valorant-leaderboards/get-valorant-leaderboards';

export const getLeaderboards = () =>
  Effect.Do.pipe(
    Effect.flatMap(() =>
      Effect.all(
        [getLeagueOfLegendsLeaderboards(), getRocketLeagueLeaderboard(), getValorantLeaderboards()],
        {
          concurrency: 'unbounded',
        }
      )
    ),
    Effect.map((leaderboards) => defu(...leaderboards))
  );
