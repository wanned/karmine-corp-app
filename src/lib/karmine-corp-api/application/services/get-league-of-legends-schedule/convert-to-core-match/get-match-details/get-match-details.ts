import { Effect, Option, Data, Cache } from 'effect';

import { getGameDetails } from './get-game-details';
import { getPlayers, initPlayersRef } from './players-ref';
import { CoreData } from '../../../../types/core-data';
import { karmineCorpLeagues } from '../../karmine-corp-leagues';

import { LeagueOfLegendsApi } from '~/lib/karmine-corp-api/infrastructure/services/league-of-legends-api/league-of-legends-api';
import { LeagueOfLegendsApiService } from '~/lib/karmine-corp-api/infrastructure/services/league-of-legends-api/league-of-legends-api-service';
import { optionGetOrFail } from '~/lib/karmine-corp-api/infrastructure/utils/effect/option-get-or-fail';

type LeagueOfLegendsMatch = LeagueOfLegendsApi.GetSchedule['data']['schedule']['events'][number];

export function getMatchDetails(match: LeagueOfLegendsMatch) {
  return Effect.scoped(
    Effect.Do.pipe(
      Effect.tap(() => initPlayersRef()),
      Effect.flatMap(() =>
        Effect.all({
          competitionName: getCompetitionName(match),
          games: getGames(match),
          bo: Effect.succeed(match.match.strategy.count),
        })
      ),
      Effect.bind('players', () =>
        Effect.catchTag(getPlayers(), 'ScopeRefNotSet', () =>
          Effect.succeed({ home: [], away: [] })
        )
      ),
      Effect.map(({ competitionName, games, bo, players }) => ({
        players,
        competitionName,
        games,
        bo,
      }))
    )
  ) satisfies Effect.Effect<CoreData.LeagueOfLegendsMatch['matchDetails'], any, any>;
}

class LeagueNotFound extends Data.TaggedError('LeagueNotFound') {}
function getCompetitionName(match: LeagueOfLegendsMatch) {
  return Effect.Do.pipe(
    Effect.map(() => karmineCorpLeagues.find((league) => league.slug === match.league.slug)?.team),
    Effect.map(Option.fromNullable),
    Effect.flatMap(optionGetOrFail(new LeagueNotFound()))
  );
}

const getMatchCached = Cache.make({
  capacity: 100,
  timeToLive: '1 minute',
  lookup: (params: Parameters<LeagueOfLegendsApiService['Type']['getMatch']>['0']) =>
    Effect.serviceMembers(LeagueOfLegendsApiService).functions.getMatch(params),
});

function getGames(match: LeagueOfLegendsMatch) {
  return Effect.Do.pipe(
    Effect.flatMap(() =>
      Effect.flatMap(getMatchCached, (matchCache) => matchCache.get({ matchId: match.match.id }))
    ),
    Effect.flatMap((matchDetails) =>
      Effect.forEach(matchDetails.data.event.match.games, (game) =>
        getGameDetails({
          ...game,
          match: matchDetails,
          startTime: match.startTime,
        })
      )
    ),
    Effect.catchAll(() => Effect.succeed([]))
  );
}
