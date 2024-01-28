import { getCoreStatus } from './get-core-match/get-core-status';
import { getAllLeagues } from './get-lol-leagues';
import { LolApiEvent } from './types';
import { DataFetcher } from '../../../data-fetcher';

export async function getLolMatches({
  filters,
  apis,
}: Pick<DataFetcher.GetScheduleParams, 'filters' | 'apis'>): Promise<LolApiEvent[]> {
  const leagues = await getAllLeagues();

  const matches = await Promise.all(
    leagues.map((league) => getLolMatchesInLeague({ apis }, league.id))
  ).then((matches) => matches.flat());

  return matches.filter((match) => filterLolEvents(match, filters));
}

async function getLolMatchesInLeague(
  { apis }: Pick<DataFetcher.GetScheduleParams, 'apis'>,
  leagueId: string
) {
  const EVENTS_WITHOUT_KARMINE_LIMIT = 100;
  let eventsWithoutKarmine: number = 0;

  const matches: LolApiEvent[] = [];

  let olderToken: string | undefined;
  do {
    const {
      events,
      pages: { older: newOlderToken },
    } = await apis.lolEsport.getScheduleByLeagueIds([leagueId], {
      pageToken: olderToken,
    });

    const karmineEvents = events.filter((event) =>
      event.match.teams.some((team) => team.name.toLowerCase().includes('karmine'))
    );

    if (karmineEvents.length === 0) {
      eventsWithoutKarmine += events.length;
    }

    matches.push(...karmineEvents);

    olderToken = newOlderToken ?? undefined;
  } while (olderToken !== undefined && eventsWithoutKarmine <= EVENTS_WITHOUT_KARMINE_LIMIT);

  return matches;
}

function filterLolEvents(
  event: LolApiEvent,
  filters: DataFetcher.GetScheduleParams['filters']
): boolean {
  if (filters.date?.from !== undefined && event.startTime < filters.date.from) return false;
  if (filters.date?.to !== undefined && event.startTime > filters.date.to) return false;

  if (filters.status !== undefined && !filters.status.includes(getCoreStatus(event.state)))
    return false;

  return true;
}
