import parseHtml from 'node-html-parser';

import { DataFetcher } from '../../../data-fetcher';
import { CoreData } from '../../../types';

export async function getLeaderboardForSeason(
  { apis, onResult }: DataFetcher.GetLeaderboardParams,
  season: string
): Promise<CoreData.Leaderboards> {
  const data = await apis.liquipedia.parse(
    `Rocket_League_Championship_Series/${season}/Rankings`,
    'rocketleague'
  );

  const html = parseHtml(data.parse.text['*']);

  const karmineCorpLeaderboardRow = html
    .querySelectorAll('.wikitable tr:has(a[title="Karmine Corp"])')
    .at(-1);

  if (!karmineCorpLeaderboardRow) return { [CoreData.CompetitionName.RocketLeague]: [] };

  const leaderboard: CoreData.Leaderboards[CoreData.CompetitionName.RocketLeague] = [];

  karmineCorpLeaderboardRow.parentNode.querySelectorAll('> *').forEach((el) => {
    if (el.classNames.includes('header')) return;

    const data = el.querySelectorAll('td');

    const rank = Number(data.at(0)?.text);
    if (isNaN(rank)) return;

    const points = Number(data.at(-1)?.text);
    if (isNaN(points)) return;

    // .team-template-image-icon
    const teamElement = el.querySelector('.team-template-image-icon img');
    const teamName = teamElement?.attributes.alt;
    let teamLogo = teamElement?.attributes.src;

    if (!teamName || !teamLogo) return;

    if (teamLogo.startsWith('/')) {
      teamLogo = `https://liquipedia.net${teamLogo}`;
    }

    leaderboard.push({
      teamName,
      teamId: teamName,
      logoUrl: teamLogo,
      position: rank,
      points,
    });
  });

  leaderboard.sort((a, b) => a.position - b.position);

  onResult({ [CoreData.CompetitionName.RocketLeague]: leaderboard });

  return { [CoreData.CompetitionName.RocketLeague]: [] };
}
