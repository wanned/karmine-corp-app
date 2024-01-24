import { getGameDetailsFromEvent } from './get-game-details';
import { findLeague } from '../get-lol-leagues';
import { ExternalMatch } from '../types';

import { CoreData } from '~/shared/data/core/types';
import { lolEsportApiClient } from '~/shared/data/external-apis/league-of-legends/lol-esport-api-client';
import { strafeApiClient } from '~/shared/data/external-apis/strafe/strafe-api-client';

export async function getMatchDetailsFromEvent(
  externalMatch: ExternalMatch
): Promise<CoreData.LeagueOfLegendsMatch['matchDetails'] | undefined> {
  const league = await findLeague(externalMatch.lol.league);
  if (league === undefined) return undefined;

  const competitionName = league.team;

  const playersSet = new Map<string, CoreData.Player & { team: 'blue' | 'red' }>();

  const strafeMatchDetails = await strafeApiClient.getMatch(externalMatch.strafe.id);
  const lolEsportMatchDetails = await lolEsportApiClient.getMatchById(externalMatch.lol.match.id);

  const games = await Promise.all(
    strafeMatchDetails
      .sort((a, b) => a.index - b.index)
      .map(async (strafeGameDetails) =>
        getGameDetailsFromEvent({
          lolEsportMatchDetails,
          startTime: externalMatch.lol.startTime,
          strafeGameDetails,
          playersSet,
        })
      )
  );

  const players: CoreData.LeagueOfLegendsMatch['matchDetails']['players'] = {
    blue: [],
    red: [],
  };
  playersSet.forEach(({ team, ...player }) => players[team].push(player));

  return {
    competitionName,
    bo: externalMatch.lol.match.strategy.count,
    games: games.filter(Boolean),
    players,
  };
}
