import { DataFetcher } from '../../../data-fetcher';

export async function getCurrentSeason({
  apis,
}: Pick<DataFetcher.GetLeaderboardParams, 'apis'>): Promise<string | undefined> {
  const data = await apis.liquipedia.parse('Rocket_League_Championship_Series', 'rocketleague');

  const seasons = data.parse.links
    .filter(
      (link) =>
        /^Rocket League Championship Series\/((Season.*)|(2\d\d\d))/.test(link['*']) &&
        link['*'].split('/').length === 2
    )
    .map((link) => link['*'].split('/')[1])
    .sort((a, b) => {
      const aSeason = a.match(/Season (\d+|X)/);
      const bSeason = b.match(/Season (\d+|X)/);

      if (aSeason && bSeason) {
        return Number(aSeason[1].replace('X', '10')) - Number(bSeason[1].replace('X', '10'));
      }

      if (aSeason) {
        return -1;
      }

      if (bSeason) {
        return 1;
      }

      return Number(a.split('-')[0]) - Number(b.split('-')[0]);
    });

  const currentSeason = seasons.at(-1);

  return currentSeason;
}
