import '@total-typescript/ts-reset';

import { getCoreMatch } from './get-core-match';
import { getRlMatches } from './get-rl-matches';
import { getUnlistedRlMatches } from './get-unlisted-rl-matches';
import { DataFetcher } from '../../../data-fetcher';
import { CoreData } from '../../../types';
import { groupMatchByBatch } from '../../utils/group-match-by-batch';

import pLimit from '~/shared/utils/p-limit';

export async function getSchedule({
  onResult,
  filters,
  batches,
  apis,
}: DataFetcher.GetScheduleParams): Promise<CoreData.RocketLeagueMatch[]> {
  if (
    filters.notGames !== undefined &&
    filters.notGames.includes(CoreData.CompetitionName.RocketLeague)
  ) {
    return [];
  }

  if (
    filters.games !== undefined &&
    !filters.games.includes(CoreData.CompetitionName.RocketLeague)
  ) {
    return [];
  }

  const rlMatches = await getRlMatches({ apis, filters });

  const groupedMatches = groupMatchByBatch(rlMatches, 'date', batches);

  const results: CoreData.RocketLeagueMatch[] = [];

  for (const matches of groupedMatches) {
    const limitConcurrency = pLimit(1);

    results.push(
      ...(
        await Promise.all(
          matches.map(async (rlApiMatch) =>
            limitConcurrency(async () => {
              const match = await getCoreMatch({ apis }, rlApiMatch);
              if (match === undefined) return undefined;

              onResult(match);

              return match;
            })
          )
        )
      ).filter(Boolean)
    );
  }

  const unlistedMatches = await getUnlistedRlMatches(results, { apis, filters });

  for (const match of unlistedMatches) {
    onResult(match);
  }

  return [...results, ...unlistedMatches];
}
