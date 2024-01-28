import { DataFetcher } from '../../data-fetcher';
import { CoreData } from '../../types';

type BaseKarmineEvent = {
  title: string;
  competition_name: string;
  team_domicile: string | null;
  team_exterieur: string | null;
  player: string | null;
  start: Date;
  streamLink?: string | null;
};

export async function getSchedule({
  onResult,
  filters,
  apis,
}: DataFetcher.GetScheduleParams): Promise<CoreData.Match[]> {
  const matches = await Promise.all([
    ...(filters.status?.includes('finished') ?
      [getMatchesResults({ onResult, filters, apis })]
    : []),
    ...(filters.status?.includes('upcoming') ? [getNextMatches({ onResult, filters, apis })] : []),
  ]);

  return matches.flat();
}

async function getMatchesResults({
  onResult,
  filters,
  apis,
}: DataFetcher.GetScheduleParams): Promise<CoreData.Match[]> {
  const eventsResults = await apis.karmine
    .getEventsResults()
    .then((events) => events.filter((event) => filterKarmineEvents(event, filters)));

  return await Promise.all(
    eventsResults.map(async (eventResult) => {
      const match = await karmineEventToCoreMatch(eventResult);
      onResult(match);
      return match;
    })
  );
}

async function getNextMatches({
  onResult,
  filters,
  apis,
}: DataFetcher.GetScheduleParams): Promise<CoreData.Match[]> {
  const events = await apis.karmine
    .getEvents()
    .then((events) => events.filter((event) => filterKarmineEvents(event, filters)));

  return await Promise.all(
    events.map(async (eventResult) => {
      const match = await karmineEventToCoreMatch(eventResult);
      onResult(match);
      return match;
    })
  );
}

function filterKarmineEvents(
  event: BaseKarmineEvent,
  filters: DataFetcher.GetScheduleParams['filters']
): boolean {
  // We don't want to fetch events that are not related to League of Legends
  // because they are fetched by another service
  if (event.competition_name === CoreData.CompetitionName.LeagueOfLegendsLEC) return false;
  if (event.competition_name === CoreData.CompetitionName.LeagueOfLegendsLFL) return false;

  if (filters.date?.from !== undefined && event.start < filters.date.from) return false;
  if (filters.date?.to !== undefined && event.start > filters.date.to) return false;

  return true;
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
