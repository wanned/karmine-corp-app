import '@total-typescript/ts-reset';

import { getCoreMatch } from './get-core-match';
import { getLolMatches } from './get-lol-matches';
import { getStrafeMatch } from './get-strafe-match';
import { LolApiEvent } from './types';
import { DataFetcher } from '../../../data-fetcher';
import { CoreData } from '../../../types';

export async function getSchedule({
  onResult,
  filters,
  batches,
  apis,
}: DataFetcher.GetScheduleParams): Promise<CoreData.LeagueOfLegendsMatch[]> {
  const lolMatches = await getLolMatches({ filters, apis });

  const groupedMatches = groupMatchByBatch(lolMatches, batches);

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

            onResult(match);

            return match;
          })
        )
      ).filter(Boolean)
    );
  }

  return results;
}

function groupMatchByBatch(
  matches: LolApiEvent[],
  batches: DataFetcher.GetScheduleParams['batches'] = []
) {
  const groupedMatches: Map<string, { matches: LolApiEvent[]; priority: number }> = new Map();

  batches.forEach(({ from, to }, index) => {
    const rangeDate = `${from.getTime()}-${to.getTime()}`;
    const matchesInDateRange = matches.filter((match) => {
      const matchDate = match.startTime.getTime();
      return matchDate >= from.getTime() && matchDate <= to.getTime();
    });

    if (matchesInDateRange.length === 0) return;

    groupedMatches.set(rangeDate, {
      matches: matchesInDateRange,
      priority: index,
    });
  });

  const sortedBatches = Array.from(groupedMatches.values())
    .sort((a, b) => a.priority - b.priority)
    .map(({ matches }) => matches);

  const matchesNotGrouped = matches.filter((match) => {
    return !sortedBatches.some((matches) => matches.includes(match));
  });

  return [...sortedBatches, matchesNotGrouped];
}
