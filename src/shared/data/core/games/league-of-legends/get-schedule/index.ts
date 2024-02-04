import '@total-typescript/ts-reset';

import { getCoreMatch } from './get-core-match';
import { getLolMatches } from './get-lol-matches';
import { getStrafeMatch } from './get-strafe-match';
import { DataFetcher } from '../../../data-fetcher';
import { CoreData } from '../../../types';
import { groupMatchByBatch } from '../../../utils/group-match-by-batch';

export async function getSchedule({
  onResult,
  filters,
  batches,
  apis,
}: DataFetcher.GetScheduleParams): Promise<CoreData.LeagueOfLegendsMatch[]> {
  if (
    filters.notGames !== undefined &&
    filters.notGames.includes(CoreData.CompetitionName.LeagueOfLegendsLEC) &&
    filters.notGames.includes(CoreData.CompetitionName.LeagueOfLegendsLFL)
  ) {
    return [];
  }

  const lolMatches = await getLolMatches({ filters, apis });

  const groupedMatches = groupMatchByBatch(lolMatches, 'startTime', batches);

  const results: CoreData.LeagueOfLegendsMatch[] = [];

  for (const matches of groupedMatches) {
    results.push(
      ...(
        await Promise.all(
          matches.map(async (lolApiMatch) => {
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

            if (
              filters.notGames !== undefined &&
              filters.notGames.includes(match.matchDetails.competitionName)
            ) {
              return undefined;
            }

            if (
              filters.games !== undefined &&
              !filters.games.includes(match.matchDetails.competitionName)
            ) {
              return undefined;
            }

            onResult(match);

            return match;
          })
        )
      ).filter(Boolean)
    );
  }

  return results;
}
