import { CoreData } from '../../types';

import { karmineApiClient } from '~/shared/data/external-apis/karmine/karmine-api-client';

type BaseKarmineEvent = {
  title: string;
  competition_name: string;
  team_domicile: string | null;
  team_exterieur: string | null;
  player: string | null;
  start: Date;
  streamLink?: string | null;
};

export async function getSchedule(
  onResult: (match: CoreData.Match) => void
): Promise<CoreData.Match[]> {
  const matches = await Promise.all([getMatchesResults(onResult), getNextMatches(onResult)]);

  return matches.flat();
}

async function getMatchesResults(
  onResult: (match: CoreData.Match) => void
): Promise<CoreData.Match[]> {
  const eventsResults = await karmineApiClient
    .getEventsResults()
    .then((events) => events.filter(filterKarmineEvents));

  return await Promise.all(
    eventsResults.map(async (eventResult) => {
      const match = await karmineEventToCoreMatch(eventResult);
      onResult(match);
      return match;
    })
  );
}

async function getNextMatches(
  onResult: (match: CoreData.Match) => void
): Promise<CoreData.Match[]> {
  const events = await karmineApiClient
    .getEvents()
    .then((events) => events.filter(filterKarmineEvents));

  return await Promise.all(
    events.map(async (eventResult) => {
      const match = await karmineEventToCoreMatch(eventResult);
      onResult(match);
      return match;
    })
  );
}

function filterKarmineEvents(event: BaseKarmineEvent): boolean {
  return (
    // We don't want to fetch events that are not related to League of Legends
    // because they are fetched by another service
    !(
      event.competition_name === CoreData.CompetitionName.LeagueOfLegendsLEC ||
      event.competition_name === CoreData.CompetitionName.LeagueOfLegendsLFL
    )
  );
}

async function karmineEventToCoreMatch(event: BaseKarmineEvent): Promise<CoreData.Match> {
  const teams = await getTeamsFromEvent(event);

  return {
    teams,
    date: event.start,
    streamLink: event.streamLink ?? null,
    status: 'finished',
    matchDetails: {
      competitionName: event.competition_name as CoreData.CompetitionName,
    },
  } satisfies CoreData.Match;
}

async function getTeamsFromEvent(
  event: BaseKarmineEvent
): Promise<[CoreData.Team, CoreData.Team | null]> {
  let teamNames = [
    ...new Set(
      event.title
        .replace(/\[.*\]/g, '')
        .split(/(?: vs )|(?:;)/)
        .map((teamName) => teamName.trim())
    ),
  ];

  if (teamNames.length > 2) {
    teamNames = teamNames.filter((teamName) => teamName.startsWith('KC'));
  }

  if (teamNames.length === 1 && event.player !== null) {
    return [
      {
        name: event.player,
        logoUrl: 'https://medias.kametotv.fr/karmine/teams/Karmine Corp-LeagueOfLegendsLEC.png',
      },
      null,
    ];
  }

  if (teamNames.length === 1) {
    return [
      {
        name: 'KC',
        logoUrl: 'https://medias.kametotv.fr/karmine/teams/Karmine Corp-LeagueOfLegendsLEC.png',
      },
      null,
    ];
  }

  return [
    {
      name: teamNames[0],
      logoUrl:
        event.team_domicile ??
        'https://medias.kametotv.fr/karmine/teams/Karmine Corp-LeagueOfLegendsLEC.png',
    },
    {
      name: teamNames[1],
      logoUrl: event.team_exterieur ?? '',
    },
  ];
}
