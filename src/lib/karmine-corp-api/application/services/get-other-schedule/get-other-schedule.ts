import { Effect, Stream } from 'effect';

import { CoreData } from '../../types/core-data';
import { GetScheduleParamsState } from '../../use-cases/get-schedule/get-schedule-params-state';

import { KarmineApi } from '~/lib/karmine-corp-api/infrastructure/services/karmine-api/karmine-api';
import { KarmineApiService } from '~/lib/karmine-corp-api/infrastructure/services/karmine-api/karmine-api-service';

export const getOtherSchedule = () =>
  Stream.concat(getUpcomingEvents(), getFinishedEvents()).pipe(Stream.filterEffect(applyFilters));

const applyFilters = (match: CoreData.Match) =>
  Effect.Do.pipe(
    Effect.flatMap(() =>
      Effect.all({
        dateRange: Effect.serviceConstants(GetScheduleParamsState).dateRange,
        ignoreIds: Effect.serviceConstants(GetScheduleParamsState).ignoreIds,
      })
    ),
    Effect.map(({ dateRange, ignoreIds }) => {
      if (dateRange !== undefined) {
        if (
          (dateRange.start !== undefined && new Date(match.date) < dateRange.start) ||
          (dateRange.end !== undefined && new Date(match.date) > dateRange.end)
        ) {
          return false;
        }
      }

      // Filter by ignoreIds
      if (ignoreIds !== undefined) {
        if (ignoreIds.includes(match.id)) {
          return false;
        }
      }

      return true;
    })
  );

const getUpcomingEvents = () =>
  Stream.fromIterableEffect(
    Effect.serviceFunctionEffect(KarmineApiService, (_) => _.getEvents)()
  ).pipe(Stream.flatMap((event) => Stream.fromEffect(karmineEventToCoreMatch(event, 'events'))));

const getFinishedEvents = () =>
  Stream.fromIterableEffect(
    Effect.serviceFunctionEffect(KarmineApiService, (_) => _.getEventsResults)()
  ).pipe(
    Stream.flatMap((event) => Stream.fromEffect(karmineEventToCoreMatch(event, 'eventsResults')))
  );

const karmineEventToCoreMatch = (
  event: KarmineApi.GetEvents[number] | KarmineApi.GetEventsResults[number],
  source: 'events' | 'eventsResults'
): Effect.Effect<CoreData.Match, never, never> =>
  Effect.Do.pipe(
    Effect.bind('teams', () => getTeamsFromEvent(event)),
    Effect.bind('id', () => calculateId(event)),
    Effect.map(({ teams, id }) => ({
      id: `all:${id}`,
      date: event.start,
      streamLink: 'streamLink' in event ? event.streamLink : null,
      status: source === 'events' ? 'upcoming' : 'finished',
      teams,
      matchDetails: {
        competitionName: event.competition_name as CoreData.CompetitionName,
      },
    }))
  );

type BaseKarmineEvent = (KarmineApi.GetEvents[number] | KarmineApi.GetEventsResults[number]) &
  Partial<
    Pick<
      KarmineApi.GetEventsResults[number],
      'score_domicile' | 'score_exterieur' | 'team_domicile'
    >
  >;

const KARMINE_LOGO_URL =
  'https://medias.kametotv.fr/karmine/teams/Karmine Corp-LeagueOfLegendsLEC.png';

const calculateId = (event: KarmineApi.GetEvents[number] | KarmineApi.GetEventsResults[number]) =>
  Effect.forEach((event.title + event.start.toISOString()).split(''), (character) =>
    Effect.succeed(character.charCodeAt(0).toString(16))
  ).pipe(Effect.map((id) => id.join('')));

const getTeamsFromEvent = (
  event: BaseKarmineEvent
): Effect.Effect<CoreData.BaseMatch['teams'], never, never> =>
  Effect.gen(function* (_) {
    const teamNames = yield* _(getTeamNamesFromEvent(event));

    if (teamNames.length === 1) {
      return [
        {
          name:
            event.player?.trim().toLowerCase() === 'kc merstach kc malibuca' ?
              'KC Merstach & KC Malibuca'
            : event.player ?? 'KC',
          logoUrl: KARMINE_LOGO_URL,
          score: yield* _(getTeamScore(event, 'domicile')),
        },
        null,
      ];
    }

    return [
      {
        name: teamNames[0],
        logoUrl: event.team_domicile?.replace('https:///', 'https://') ?? KARMINE_LOGO_URL, // The domicile team is always Karmine Corp
        score: yield* _(getTeamScore(event, 'domicile')),
      },
      {
        name: teamNames[1],
        logoUrl: event.team_exterieur?.replace('https:///', 'https://') ?? '',
        score: yield* _(getTeamScore(event, 'exterieur')),
      },
    ];
  });

const getTeamNamesFromEvent = (event: BaseKarmineEvent): Effect.Effect<string[], never, never> =>
  Effect.gen(function* (_) {
    let teamNames = [
      ...new Set(
        event.title
          .replace(/\[.*\]/g, '')
          .split(/(?: vs )|(?:;)/)
          .map((teamName) => teamName.trim())
      ),
    ];

    if (teamNames.length > 2) {
      // It should never happen, but if it does, we only want to keep the team names that start with 'KC'
      teamNames = teamNames.filter((teamName) => teamName.startsWith('KC'));
    }

    if (teamNames.length === 2) {
      teamNames[0] = (yield* _(getTeamNameFromImageUrl(event.team_domicile))) ?? teamNames[0];
      teamNames[1] = (yield* _(getTeamNameFromImageUrl(event.team_exterieur))) ?? teamNames[1];
    }

    for (let i = 0; i < teamNames.length; i++) {
      if (teamNames[i].startsWith('KC')) teamNames[i] = 'Karmine Corp';
    }

    return teamNames;
  });

const getTeamNameFromImageUrl = (
  imageUrl: string | null
): Effect.Effect<string | undefined, never, never> =>
  Effect.gen(function* (_) {
    if (imageUrl === null) {
      return;
    }

    const imageName = imageUrl.split('/').at(-1)?.split('.').slice(0, -1).join(' ');

    if (imageName === undefined) {
      return;
    }

    let teamName = imageName.split('-').at(0)?.split('logo').at(0);

    if (teamName === undefined || teamName.trim() === '') {
      return;
    }

    if (teamName.toLowerCase().startsWith('no_team') || teamName.toLowerCase() === 'valorant') {
      return;
    }

    if (teamName.toLowerCase().endsWith('_w')) {
      teamName = teamName.slice(0, -2);
    }

    if (
      teamName[0].toLowerCase() === teamName[0] &&
      teamName.slice(1).toUpperCase() === teamName.slice(1)
    ) {
      // If the team name looks like 'kARMINE', it is likely that the name is not formatted correctly
      // and we have to capitalize the first letter of each word

      teamName = teamName
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }

    teamName = teamName.replace(/_/g, ' ').trim();

    if (teamName === 'NON DECIDÉ') {
      teamName = '?';
    }

    return teamName;
  });

const getTeamScore = (
  event: BaseKarmineEvent,
  team: 'domicile' | 'exterieur'
): Effect.Effect<CoreData.Score | undefined, never, never> =>
  Effect.gen(function* (_) {
    const scoreDomicile = event.score_domicile;
    const scoreExterieur = event.score_exterieur;

    if (scoreDomicile === undefined || scoreExterieur === undefined) {
      return;
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
      return;
    }

    if (score.startsWith('TOP')) {
      return {
        score: parseInt(score.slice(3).trim(), 10),
        scoreType: 'top',
      };
    }

    const parsedScore = parseInt(score, 10);
    const opponentScore = team === 'domicile' ? scoreExterieur : scoreDomicile;

    if (opponentScore === null) {
      return;
    }

    const parsedOpponentScore = parseInt(opponentScore, 10);

    return {
      score: parseInt(score, 10),
      isWinner: parsedScore > parsedOpponentScore,
    };
  });
