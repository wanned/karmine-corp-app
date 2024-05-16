import { Console, Effect } from 'effect';
import { atom, useAtom, useStore } from 'jotai';
import { useEffect } from 'react';

import { mainLayer } from './utils/main-layer';
import { CoreData } from '../../application/types/core-data';
import { getTeams } from '../../application/use-cases/get-teams/get-teams';

const teamsAtom = atom<CoreData.KarminePlayers>({});
const teamsFetchingStatusAtom = atom<'idle' | 'loading' | 'initialized' | 'error'>('idle');

export const useTeams = () => {
  const [teams, setTeams] = useAtom(teamsAtom);
  const [teamsFetchingStatus, setTeamsFetchingStatus] = useAtom(teamsFetchingStatusAtom);

  const store = useStore();
  useEffect(() => {
    if (store.get(teamsFetchingStatusAtom) !== 'idle') {
      return;
    }
    store.set(teamsFetchingStatusAtom, 'loading');

    Effect.runPromise(
      Effect.provide(
        Effect.catchAll(
          Effect.Do.pipe(
            Effect.flatMap(() => getTeams()),
            Effect.map((teams) => {
              setTeams(teams);
              setTeamsFetchingStatus('initialized');
            })
          ),
          (error) =>
            Effect.Do.pipe(
              Effect.flatMap(() => Console.error(error)),
              Effect.map(() => setTeamsFetchingStatus('error'))
            )
        ),
        mainLayer
      )
    ).catch((error) => {
      console.error(error);
      setTeamsFetchingStatus('error');
    });
  }, [store, setTeams]);

  return {
    teams,
    teamsFetchingStatus,
  };
};
