import { ExternalMatch, LolApiTeam } from '../types';

import { CoreData } from '~/shared/data/core/types';

export async function getTeamsFromEvent(
  externalMatch: ExternalMatch
): Promise<CoreData.LeagueOfLegendsMatch['teams']> {
  const parseTeam = (team: LolApiTeam) =>
    ({
      name: team.name,
      logoUrl: team.image.replace('http:', 'https:'),
      score:
        team.result !== null && team.result.outcome !== null ?
          {
            score: team.result.gameWins,
            scoreType: 'gameWins',
            isWinner: team.result.outcome === 'win',
          }
        : undefined,
    }) satisfies CoreData.LeagueOfLegendsMatch['teams'][number];

  const teamA = externalMatch.lol.match.teams[0];
  const teamB = externalMatch.lol.match.teams[1];

  return [parseTeam(teamA), parseTeam(teamB)];
}
