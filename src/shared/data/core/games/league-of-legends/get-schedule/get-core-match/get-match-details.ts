import { getGameDetailsFromEvent } from './get-game-details';
import { findLeague } from '../get-lol-leagues';
import { ExternalMatch } from '../types';

import { DataFetcher } from '~/shared/data/core/data-fetcher';
import { CoreData } from '~/shared/data/core/types';

export async function getMatchDetailsFromEvent(
  { apis }: Pick<DataFetcher.GetScheduleParams, 'apis'>,
  externalMatch: ExternalMatch
): Promise<CoreData.LeagueOfLegendsMatch['matchDetails'] | undefined> {
  const league = await findLeague(externalMatch.lol.league);
  if (league === undefined) return undefined;

  const competitionName = league.team;

  const playersMap = new Map<string, CoreData.Player & { team: 'home' | 'away' }>();

  const strafeMatchDetails = await apis.strafe.getMatch(externalMatch.strafe.id);
  const lolEsportMatchDetails = await apis.lolEsport.getMatchById(externalMatch.lol.match.id);
  lolEsportMatchDetails.games.sort((a, b) => a.number - b.number);

  const games = await Promise.all(
    lolEsportMatchDetails.games.map(async (lolGame) =>
      getGameDetailsFromEvent(
        { apis },
        {
          lolEsportMatchDetails,
          strafeMatchDetails,
          gameNumber: lolGame.number,
          startTime: externalMatch.lol.startTime,
          playersMap,
        }
      )
    )
  );

  const players: CoreData.LeagueOfLegendsMatch['matchDetails']['players'] = {
    home: [],
    away: [],
  };
  playersMap.forEach(({ team, ...player }) => players[team].push(player));

  return {
    competitionName,
    bo: externalMatch.lol.match.strategy.count,
    games: games.filter(Boolean),
    players,
  };
}
