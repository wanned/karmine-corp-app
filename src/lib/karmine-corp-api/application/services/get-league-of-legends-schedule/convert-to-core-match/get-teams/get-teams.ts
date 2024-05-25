import { Effect } from 'effect';

import { CoreData } from '../../../../types/core-data';

import { LeagueOfLegendsApi } from '~/lib/karmine-corp-api/infrastructure/services/league-of-legends-api/league-of-legends-api';

type LeagueOfLegendsMatch = LeagueOfLegendsApi.GetSchedule['data']['schedule']['events'][number];

export function getTeams(match: LeagueOfLegendsMatch) {
  return Effect.all([
    getTeam(match.match.teams[0], match.state),
    getTeam(match.match.teams[1], match.state),
  ]) satisfies Effect.Effect<CoreData.LeagueOfLegendsMatch['teams'], any, any>;
}

function getTeam(
  team: LeagueOfLegendsMatch['match']['teams'][number],
  state: LeagueOfLegendsMatch['state']
) {
  return Effect.succeed({
    name: team.name,
    logoUrl: team.image.replace('http:', 'https:'),
    score:
      team.result !== null && state !== 'unstarted' ?
        {
          score: team.result.gameWins,
          scoreType: 'gameWins' as const,
          isWinner: team.result.outcome === 'win',
        }
      : undefined,
  });
}
