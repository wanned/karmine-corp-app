import { DataFetcher } from '~/shared/data/core/data-fetcher';

export async function getChampionImageUrl(
  { apis }: Pick<DataFetcher.GetScheduleParams, 'apis'>,
  championId: string
) {
  const lastGameVersion = await apis.lolEsport.getAllVersions().then((versions) => versions[0]);

  return `https://ddragon.leagueoflegends.com/cdn/${lastGameVersion}/img/champion/${championId}.png`;
}
