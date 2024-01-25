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

  const playersMap = new Map<string, CoreData.Player & { team: 'home' | 'away' }>();

  const strafeMatchDetails = await strafeApiClient.getMatch(externalMatch.strafe.id);
  const lolEsportMatchDetails = await lolEsportApiClient.getMatchById(externalMatch.lol.match.id);
  lolEsportMatchDetails.games.sort((a, b) => a.number - b.number);

  const games = await Promise.all(
    lolEsportMatchDetails.games.map(async (lolGame) =>
      getGameDetailsFromEvent({
        lolEsportMatchDetails,
        strafeMatchDetails,
        gameNumber: lolGame.number,
        startTime: externalMatch.lol.startTime,
        playersMap,
      })
    )
  );

  const players: CoreData.LeagueOfLegendsMatch['matchDetails']['players'] = {
    home: [],
    away: [],
  };
  playersMap.forEach(({ team, ...player }) => players[team].push(player));

  if (players.away.length === 0 && players.home.length !== 0)
    console.log(lolEsportMatchDetails.games.at(0)?.id);

  return {
    competitionName,
    bo: externalMatch.lol.match.strategy.count,
    games: games.filter(Boolean),
    players,
  };
}
