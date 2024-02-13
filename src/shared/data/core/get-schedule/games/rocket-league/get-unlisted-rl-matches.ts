import { isSameDay } from 'date-fns';

import { DataFetcher } from '../../../data-fetcher';
import { CoreData } from '../../../types';
import { getSchedule as getAllMatches } from '../all/get-schedule';

export async function getUnlistedRlMatches(
  rlMatches: CoreData.RocketLeagueMatch[],
  { apis, filters }: Pick<DataFetcher.GetScheduleParams, 'apis' | 'filters'>
): Promise<CoreData.RocketLeagueMatch[]> {
  const allMatches = await getAllMatches({
    apis,
    onResult: () => {},
    filters: {
      ...filters,
      games: [CoreData.CompetitionName.RocketLeague],
      notGames: [],
    },
  });

  const rlMatchDates = rlMatches.map((match) => match.date);
  const unlistedMatches = allMatches.filter(
    (match) => !rlMatchDates.some((date) => isSameDay(date, match.date))
  );

  return unlistedMatches.map((match) => ({
    ...match,
    id: `rl:${match.id}`,
    matchDetails: {
      ...match.matchDetails,
      competitionName: CoreData.CompetitionName.RocketLeague,
      games: [],
      players: {
        home: [],
        away: [],
      },
    },
  }));
}
