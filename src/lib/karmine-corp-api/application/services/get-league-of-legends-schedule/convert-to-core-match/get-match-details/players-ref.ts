import { Effect } from 'effect';

import { CoreData } from '../../../../types/core-data';

import { createScopedRef } from '~/lib/karmine-corp-api/infrastructure/utils/effect/create-scoped-ref';

export const {
  init: initPlayersRef,
  get: getPlayers,
  set: setPlayers,
} = createScopedRef<NonNullable<CoreData.Match['matchDetails']['players']>>();

export const addPlayer = <E, R>(
  team: 'home' | 'away',
  playerEffect: Effect.Effect<CoreData.Player, E, R>
) =>
  Effect.Do.pipe(
    Effect.flatMap(getPlayers),
    Effect.catchTag('ScopeRefNotSet', () => Effect.succeed({ home: [], away: [] })),
    Effect.flatMap((players) =>
      Effect.all({
        players: Effect.succeed(players),
        newPlayer: playerEffect,
      })
    ),
    Effect.map(({ players, newPlayer }) => {
      if (
        Object.values(players)
          .flat()
          .some((player) => player.name === newPlayer.name)
      ) {
        return players;
      }
      return {
        ...players,
        [team]: [...players[team], newPlayer],
      };
    }),
    Effect.flatMap(setPlayers)
  );
