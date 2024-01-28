import '@total-typescript/ts-reset';

import { getCoreMatch } from './get-core-match';
import { getLolMatches } from './get-lol-matches';
import { getStrafeMatch } from './get-strafe-match';
import { DataFetcher } from '../../../data-fetcher';
import { CoreData } from '../../../types';

export async function getSchedule({
  onResult,
  filters,
  apis,
}: DataFetcher.GetScheduleParams): Promise<CoreData.LeagueOfLegendsMatch[]> {
  const lolMatches = await getLolMatches({ filters, apis });

  return await Promise.all(
    lolMatches.map(async (lolApiMatch) => {
      const strafeMatch = await getStrafeMatch({ apis }, lolApiMatch);
      if (strafeMatch === undefined) return undefined;

      const match = await getCoreMatch(
        { apis },
        {
          lol: lolApiMatch,
          strafe: strafeMatch,
        }
      );
      if (match === undefined) return undefined;

      onResult(match);

      return match;
    })
  ).then((matches) => matches.filter(Boolean));
}
