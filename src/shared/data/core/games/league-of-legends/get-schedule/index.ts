import '@total-typescript/ts-reset';

import { getCoreMatch } from './get-core-match';
import { getLolMatches } from './get-lol-matches';
import { getStrafeMatch } from './get-strafe-match';
import { CoreData } from '../../../types';

export async function getSchedule(
  onResult: (match: CoreData.LeagueOfLegendsMatch) => void
): Promise<CoreData.LeagueOfLegendsMatch[]> {
  const lolMatches = await getLolMatches();

  return await Promise.all(
    lolMatches.map(async (lolApiMatch) => {
      const strafeMatch = await getStrafeMatch(lolApiMatch);
      if (strafeMatch === undefined) return undefined;

      const match = await getCoreMatch({
        lol: lolApiMatch,
        strafe: strafeMatch,
      });
      if (match === undefined) return undefined;

      onResult(match);

      return match;
    })
  ).then((matches) => matches.filter(Boolean));
}
