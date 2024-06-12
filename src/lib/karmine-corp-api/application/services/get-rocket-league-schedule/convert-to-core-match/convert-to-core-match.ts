import { Effect } from 'effect';

import { getMatchId } from './utils/get-match-id';
import { CoreData } from '../../../types/core-data';

import { OctaneApi } from '~/lib/karmine-corp-api/infrastructure/services/octane-api/octane-api';
import { OctaneApiService } from '~/lib/karmine-corp-api/infrastructure/services/octane-api/octane-api-service';

type RocketLeagueMatch = OctaneApi.GetMatches['matches'][number];

export function convertToCoreMatch(match: RocketLeagueMatch) {
  return Effect.all({
    id: getMatchId(match),
    date: Effect.succeed(match.date),
    matchDetails: Effect.all({
      competitionName: Effect.succeed(CoreData.CompetitionName.RocketLeague as const),
      bo: Effect.succeed(match.format.length),
      games: getGames(match),
      players: Effect.all({
        home: Effect.forEach(match.blue.players, (player) =>
          Effect.succeed({ name: player.player.tag })
        ),
        away: Effect.forEach(match.orange.players, (player) =>
          Effect.succeed({ name: player.player.tag })
        ),
      }),
    }),
    status: getStatus(match),
    teams: Effect.all([getTeam(match, 'blue'), getTeam(match, 'orange')]),
    streamLink: Effect.succeed('https://twitch.tv/kamet0'), // TODO
  }) satisfies Effect.Effect<CoreData.RocketLeagueMatch, any, any>;
}

function getGames(match: RocketLeagueMatch) {
  return Effect.Do.pipe(
    Effect.flatMap(() =>
      Effect.serviceMembers(OctaneApiService).functions.getMatchGames({ matchId: match._id })
    ),
    Effect.map((response) =>
      response.games.map((game) =>
        game.blue.team.stats === undefined || game.orange.team.stats === undefined ?
          undefined
        : {
            teams: {
              home: {
                goals: game.blue.team.stats.core.goals,
                stops: game.blue.team.stats.core.saves,
                totalPoints: game.blue.team.stats.core.score,
              },
              away: {
                goals: game.orange.team.stats.core.goals,
                stops: game.orange.team.stats.core.saves,
                totalPoints: game.orange.team.stats.core.score,
              },
            },
          }
      )
    )
  ) satisfies Effect.Effect<CoreData.RocketLeagueMatch['matchDetails']['games'], any, any>;
}

function getStatus(match: RocketLeagueMatch) {
  return Effect.Do.pipe(
    Effect.map(() =>
      match.blue.score + match.orange.score === 0 ? 'upcoming'
      : [match.blue.score, match.orange.score].includes(Math.ceil(match.format.length / 2)) ?
        'finished'
      : 'live'
    )
  ) satisfies Effect.Effect<CoreData.RocketLeagueMatch['status'], any, any>;
}

function getTeam(match: RocketLeagueMatch, team: 'blue' | 'orange') {
  return Effect.Do.pipe(
    Effect.flatMap(() => getStatus(match)),
    Effect.map((status) => ({
      name: match[team].team.team.name,
      logoUrl:
        match[team].team.team.image ??
        'https://medias.kametotv.fr/karmine/teams_logo/NO_TEAM_RL.png',
      score:
        status === 'upcoming' ? undefined : (
          {
            score: match[team].score,
            isWinner: match[team].winner,
            scoreType: 'gameWins',
          }
        ),
    }))
  ) satisfies Effect.Effect<CoreData.RocketLeagueMatch['teams'][0], any, any>;
}
