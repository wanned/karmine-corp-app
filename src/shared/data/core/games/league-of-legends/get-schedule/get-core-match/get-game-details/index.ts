import { getAllPlayers } from './get-all-players';
import { getChampionImageUrl } from './get-champion-image-url';
import { getLastGameWindow } from './get-last-game-window';
import { getCoreStatus } from '../get-core-status';

import { CoreData } from '~/shared/data/core/types';
import { lolEsportApiClient } from '~/shared/data/external-apis/league-of-legends/lol-esport-api-client';
import { strafeApiClient } from '~/shared/data/external-apis/strafe/strafe-api-client';

export async function getGameDetailsFromEvent({
  lolEsportMatchDetails,
  strafeGameDetails,
  startTime,
  playersSet,
}: {
  lolEsportMatchDetails: Awaited<ReturnType<typeof lolEsportApiClient.getMatchById>>;
  strafeGameDetails: Awaited<ReturnType<typeof strafeApiClient.getMatch>>[number];
  startTime: Date;
  playersSet: Map<string, CoreData.Player & { team: 'blue' | 'red' }>;
}): Promise<CoreData.LeagueOfLegendsMatch['matchDetails']['games'][number] | undefined> {
  const lolGame = lolEsportMatchDetails.match.games.find(
    (game) => game.number - 1 === strafeGameDetails.index
  );
  if (lolGame === undefined) return undefined;

  const lolGameDetails = await getLastGameWindow(lolGame.id, startTime);
  if (lolGameDetails === null) return undefined;

  return {
    status: getCoreStatus(strafeGameDetails.status),
    score: {
      blue: strafeGameDetails.game.score.home,
      red: strafeGameDetails.game.score.away,
    },
    duration: strafeGameDetails.game.duration,
    draft: {
      blue: {
        picks: await getTeamPicks('blue', { lolGameDetails, playersSet }),
      },
      red: {
        picks: await getTeamPicks('red', { lolGameDetails, playersSet }),
      },
    },
  };
}

async function getTeamPicks(
  team: 'blue' | 'red',
  {
    lolGameDetails,
    playersSet,
  }: {
    lolGameDetails: NonNullable<Awaited<ReturnType<typeof lolEsportApiClient.getGameWindow>>>;
    playersSet: Map<string, CoreData.Player & { team: 'blue' | 'red' }>;
  }
) {
  const allWorldPlayers = await getAllPlayers();

  return Promise.all(
    lolGameDetails.gameMetadata[`${team}TeamMetadata`].participantMetadata.map(
      async (participant) => {
        if (!playersSet.has(participant.summonerName)) {
          playersSet.set(participant.summonerName, {
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
