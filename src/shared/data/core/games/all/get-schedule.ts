import { DataFetcher } from '../../data-fetcher';
import { CoreData } from '../../types';

type BaseKarmineEvent = {
  id: number;
  title: string;
  competition_name: string;
  team_domicile: string | null;
  team_exterieur: string | null;
  score_domicile?: string | null;
  score_exterieur?: string | null;
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
    ...(filters.status?.includes('finished') || (filters.status?.length ?? 0) === 0 ?
      [getMatchesResults({ onResult, filters, apis })]
    : []),
    ...(filters.status?.includes('upcoming') || (filters.status?.length ?? 0) === 0 ?
      [getNextMatches({ onResult, filters, apis })]
    : []),
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
      const match = await karmineEventToCoreMatch(eventResult, 'finished');
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
      const match = await karmineEventToCoreMatch(eventResult, 'upcoming');
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

async function karmineEventToCoreMatch(
  event: BaseKarmineEvent,
  status: CoreData.Match['status']
): Promise<CoreData.Match> {
  const teams = await getTeamsFromEvent(event);

  return {
    id: `all:${event.id}`,
    teams,
    date: event.start,
    streamLink: event.streamLink ?? null,
    status,
    matchDetails: {
      competitionName: event.competition_name as CoreData.CompetitionName,
    },
  } satisfies CoreData.Match;
}

async function getTeamsFromEvent(event: BaseKarmineEvent): Promise<CoreData.BaseMatch['teams']> {
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
        score: getTeamScore(event, 'domicile'),
      },
      null,
    ];
  }

  if (teamNames.length === 1) {
    return [
      {
        name: 'KC',
        logoUrl: 'https://medias.kametotv.fr/karmine/teams/Karmine Corp-LeagueOfLegendsLEC.png',
        score: getTeamScore(event, 'domicile'),
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
      score: getTeamScore(event, 'domicile'),
    },
    {
      name: teamNames[1],
      logoUrl: event.team_exterieur ?? '',
      score: getTeamScore(event, 'exterieur'),
    },
  ];
}

function getTeamScore(
  event: BaseKarmineEvent,
  team: 'domicile' | 'exterieur'
): CoreData.Score | undefined {
  const scoreDomicile = event.score_domicile;
  const scoreExterieur = event.score_exterieur;

  if (scoreDomicile === undefined || scoreExterieur === undefined) {
    return undefined;
  }

  if (scoreDomicile === 'WIN') {
    if (team === 'domicile') {
      return {
        score: 1,
        isWinner: true,
      };
    } else {
      return {
        score: 0,
        isWinner: false,
      };
    }
  } else if (scoreDomicile === 'LOSE') {
    if (team === 'domicile') {
      return {
        score: 0,
        isWinner: false,
      };
    } else {
      return {
        score: 1,
        isWinner: true,
      };
    }
  }

  const score = team === 'domicile' ? scoreDomicile : scoreExterieur;

  if (score === null) {
    return undefined;
  }

  if (score.startsWith('TOP')) {
    return {
      score: parseInt(score.slice(3).trim(), 10),
      scoreType: 'top',
    };
  }

  const parsedScore = parseInt(score, 10);
  const otherScore = team === 'domicile' ? scoreExterieur : scoreDomicile;

  if (otherScore === null) {
    return undefined;
  }

  const parsedOtherScore = parseInt(otherScore, 10);

  return {
    score: parseInt(score, 10),
    isWinner: parsedScore > parsedOtherScore,
  };
}
