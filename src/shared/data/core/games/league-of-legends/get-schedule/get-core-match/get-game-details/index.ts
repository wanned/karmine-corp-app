import { getAllPlayers } from './get-all-players';
import { getChampionImageUrl } from './get-champion-image-url';
import { getLastGameWindow } from './get-last-game-window';
import { LolApiGameDetails, LolApiMatchDetails, StrafeApiMatchDetails } from '../../types';
import { getCoreStatus } from '../get-core-status';

import { CoreData } from '~/shared/data/core/types';

export async function getGameDetailsFromEvent({
  lolEsportMatchDetails,
  strafeMatchDetails,
  gameNumber,
  startTime,
  playersMap,
}: {
  lolEsportMatchDetails: LolApiMatchDetails;
  strafeMatchDetails: StrafeApiMatchDetails;
  gameNumber: number;
  startTime: Date;
  playersMap: Map<string, CoreData.Player & { team: 'home' | 'away' }>;
}): Promise<CoreData.LeagueOfLegendsMatch['matchDetails']['games'][number] | undefined> {
  const lolGame = lolEsportMatchDetails.games.find((game) => game.number === gameNumber);
  if (lolGame === undefined) return undefined;

  const strafeGameDetails = strafeMatchDetails.find((game) => game.index === gameNumber - 1);

  const lolGameDetails = await getLastGameWindow(lolGame.id, startTime);
  if (lolGameDetails === null) return undefined;

  const lastFrame = lolGameDetails.frames.at(-1);
  if (lastFrame === undefined) return undefined;

  const firstGame = lolEsportMatchDetails.games[0];
  const homeTeam = firstGame.teams.find((team) => team.side === 'blue');
  if (homeTeam === undefined) return undefined;

  const homeColor = lolGame.teams.find((team) => team.id === homeTeam.id)?.side;
  if (homeColor === undefined) return undefined;
  const awayColor = homeColor === 'blue' ? 'red' : 'blue';

  if (gameNumber !== 1) {
    // If we are not in the first game, we do not want to add players to the map.
    // We only want to add players from the first game.
    // This is because this function is called in a Promise.all, so if there is multiple games,
    // where the teams are not the same side between the games, the players could all be added
    // to the home team, or all to the away team.
    playersMap = new Map();
  }

  return {
    status: getCoreStatus(lastFrame.gameState === 'paused' ? 'finished' : lastFrame.gameState),
    score: {
      home: lastFrame[`${homeColor}Team`].totalKills,
      away: lastFrame[`${awayColor}Team`].totalKills,
    },
    draft: {
      home: {
        picks: await getTeamPicks(homeColor, { lolGameDetails, playersMap, team: 'home' }),
      },
      away: {
        picks: await getTeamPicks(awayColor, { lolGameDetails, playersMap, team: 'away' }),
      },
    },
    duration: strafeGameDetails?.game.duration,
    winnerTeam: strafeGameDetails?.winner ?? undefined,
  };
}

async function getTeamPicks(
  side: 'blue' | 'red',
  {
    lolGameDetails,
    playersMap,
    team,
  }: {
    lolGameDetails: LolApiGameDetails;
    playersMap: Map<string, CoreData.Player & { team: 'home' | 'away' }>;
    team: 'home' | 'away';
  }
) {
  const allWorldPlayers = await getAllPlayers();

  return Promise.all(
    lolGameDetails.gameMetadata[`${side}TeamMetadata`].participantMetadata.map(
      async (participant) => {
        if (!playersMap.has(participant.summonerName)) {
          playersMap.set(participant.summonerName, {
            name: participant.summonerName,
            imageUrl:
              participant.esportsPlayerId !== undefined ?
                allWorldPlayers.find((player) => player.id === participant.esportsPlayerId)?.image
              : undefined,
            role: participant.role,
            team,
          });
        }

        return {
          champion: {
            name: participant.championId,
            imageUrl: await getChampionImageUrl(participant.championId),
          },
          player: participant.summonerName,
        };
      }
    )
  );
}
