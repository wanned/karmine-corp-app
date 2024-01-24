import { lolEsportApiClient } from '~/shared/data/external-apis/league-of-legends/lol-esport-api-client';

export async function getChampionImageUrl(championId: string) {
  const lastGameVersion = await lolEsportApiClient.getAllVersions().then((versions) => versions[0]);

  return `https://ddragon.leagueoflegends.com/cdn/${lastGameVersion}/img/champion/${championId}.png`;
}
