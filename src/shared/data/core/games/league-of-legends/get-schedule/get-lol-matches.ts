import { getAllLeagues } from './get-lol-leagues';
import { LolApiEvent } from './types';

import { lolEsportApiClient } from '~/shared/data/external-apis/league-of-legends/lol-esport-api-client';

export async function getLolMatches() {
  const leagues = await getAllLeagues();

  const matches = await Promise.all(leagues.map((league) => getLolMatchesInLeague(league.id))).then(
    (matches) => matches.flat()
  );

  return matches;
}

async function getLolMatchesInLeague(leagueId: string) {
  const EVENTS_WITHOUT_KARMINE_LIMIT = 100;
  let eventsWithoutKarmine: number = 0;

  const matches: LolApiEvent[] = [];

  let olderToken: string | undefined;
  do {
    const {
      events,
      pages: { older: newOlderToken },
    } = await lolEsportApiClient.getScheduleByLeagueIds([leagueId], {
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
