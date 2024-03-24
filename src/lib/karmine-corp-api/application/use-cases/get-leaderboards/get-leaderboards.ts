import defu from 'defu';
import { Effect } from 'effect';

import { getLeagueOfLegendsLeaderboards } from '../../services/get-league-of-leagends-leaderboards/get-league-of-legends-leaderboards';
import { getRocketLeagueLeaderboard } from '../../services/get-rocket-league-leaderboard/get-rocket-league-leaderboard';

export const getLeaderboards = () =>
  Effect.Do.pipe(
    Effect.flatMap(() =>
      Effect.all([getLeagueOfLegendsLeaderboards(), getRocketLeagueLeaderboard()], {
        concurrency: 'unbounded',
      })
    ),
    Effect.map((leaderboards) => defu(...leaderboards))
  );
