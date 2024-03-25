import { Console, Effect } from 'effect';
import { atom, useAtom, useStore } from 'jotai';
import { useEffect } from 'react';

import { mainLayer } from './utils/main-layer';
import { CoreData } from '../../application/types/core-data';
import { getLeaderboards } from '../../application/use-cases/get-leaderboards/get-leaderboards';

const leaderboardsAtom = atom<CoreData.Leaderboards>({});
const leaderboardsFetchingStatusAtom = atom<'idle' | 'loading' | 'initialized' | 'error'>('idle');

export const useLeaderboards = () => {
  const [leaderboards, setLeaderboards] = useAtom(leaderboardsAtom);
  const [leaderboardsFetchingStatus, setLeaderboardsFetchingStatus] = useAtom(
    leaderboardsFetchingStatusAtom
  );

  const store = useStore();
  useEffect(() => {
    if (store.get(leaderboardsFetchingStatusAtom) !== 'idle') {
      return;
    }
    store.set(leaderboardsFetchingStatusAtom, 'loading');

    Effect.runPromise(
      Effect.provide(
        Effect.catchAll(
          Effect.Do.pipe(
            Effect.flatMap(() => getLeaderboards()),
            Effect.map((leaderboards) => {
              setLeaderboards(leaderboards);
              setLeaderboardsFetchingStatus('initialized');
            })
          ),
          (error) =>
            Effect.Do.pipe(
              Effect.flatMap(() => Console.error(error)),
              Effect.map(() => setLeaderboardsFetchingStatus('error'))
            )
        ),
        mainLayer
      )
    ).catch((error) => {
      console.error(error);
      setLeaderboardsFetchingStatus('error');
    });
  }, [store, setLeaderboards, setLeaderboardsFetchingStatus]);

  return {
    leaderboards,
    leaderboardsFetchingStatus,
  };
};
