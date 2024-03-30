import { Chunk, Effect, Option, Schedule, Stream } from 'effect';

import { CoreData } from '../../types/core-data';
import { GetScheduleParamsState } from '../../use-cases/get-schedule/get-schedule-params-state';
import { getOtherSchedule } from '../get-other-schedule/get-other-schedule';

import { OctaneApi } from '~/lib/karmine-corp-api/infrastructure/services/octane-api/octane-api';
import { OctaneApiService } from '~/lib/karmine-corp-api/infrastructure/services/octane-api/octane-api-service';
import { isSameDay } from '~/shared/utils/is-same-day';

const KARMINE_CORP_OCTANE_TEAM_ID = '60fbc5b887f814e9fbffdcbd';

export const getRocketLeagueSchedule = () => {
  const matchesStream = Stream.paginateChunkEffect(
    undefined as OctaneApi.GetMatches | undefined,
    (lastResponse) =>
      Effect.Do.pipe(
        Effect.flatMap(() =>
          Effect.serviceFunctionEffect(
            OctaneApiService,
            (_) => _.getMatches
          )({
            teamId: KARMINE_CORP_OCTANE_TEAM_ID,
            page: lastResponse ? lastResponse.page + 1 : undefined,
          })
        ),
        // FIXME: If the page has not reached yet the date range filter, we should keep fetching until we reach it. But we are not doing that.
        Effect.flatMap(applyFilters),
        Effect.map(([matchesChunk, matchesResponse]) =>
          matchesResponse.pipe(
            Option.flatMap((newResponse) =>
              newResponse.pageSize < newResponse.perPage ? Option.some(newResponse) : Option.none()
            ),
            Option.match({
              onSome: (newResponse) => [matchesChunk, Option.some(newResponse)] as const,
              onNone: () => [matchesChunk, Option.none<OctaneApi.GetMatches>()] as const,
            })
          )
        )
      )
  ).pipe(
    Stream.flatMap((match) => Stream.fromEffect(getCoreMatch(match)), {
      concurrency: 10,
    })
  );

  return Stream.merge(
    // listed matches
    matchesStream,
    // unlisted matches
    matchesStream.pipe(
      Stream.runCollect,
      Stream.flatMap((listedMatches) =>
        getOtherSchedule().pipe(
          Stream.schedule(Schedule.spaced(1)), // NOTE: This is required to slow down the JS thread and prevent it to drop to 0 FPS
          Stream.filter(
            (unlistedMatch) =>
              unlistedMatch.matchDetails.competitionName ===
                CoreData.CompetitionName.RocketLeague &&
              !Chunk.some(listedMatches, (listedMatch) =>
                isSameDay(new Date(listedMatch.date), new Date(unlistedMatch.date))
              )
          ),
          Stream.map((unlistedMatch) => ({
            ...unlistedMatch,
            id: `rl:${unlistedMatch.id}`,
            matchDetails: {
              ...unlistedMatch.matchDetails,
              competitionName: CoreData.CompetitionName.RocketLeague,
              games: [],
              players: {
                home: [],
                away: [],
              },
            },
          }))
        )
      )
    )
  );
};

type OctaneApiMatch = OctaneApi.GetMatches['matches'][number];

const applyFilters = (matchesResponse: OctaneApi.GetMatches) =>
  Effect.Do.pipe(
    Effect.flatMap(() =>
      Effect.all({
        dateRange: Effect.serviceConstants(GetScheduleParamsState).dateRange,
      })
    ),
    Effect.map(({ dateRange }) =>
      Chunk.fromIterable(matchesResponse.matches).pipe(applyDateRangeFilter(dateRange))
    ),
    Effect.map((matchesChunk) =>
      matchesChunk.length > 0 ?
        ([matchesChunk, Option.some<OctaneApi.GetMatches>(matchesResponse)] as const)
      : ([matchesChunk, Option.none<OctaneApi.GetMatches>()] as const)
    )
  );

const applyDateRangeFilter = (dateRange: GetScheduleParamsState['Type']['dateRange']) =>
  Chunk.filter<OctaneApiMatch>(
    (match) =>
      (dateRange?.start === undefined || match.date >= dateRange.start) &&
      (dateRange?.end === undefined || match.date <= dateRange.end)
  );

const getCoreMatch = (rlApiMatch: OctaneApiMatch) =>
  Effect.gen(function* (_) {
    const status = yield* _(getStatusFromMatch(rlApiMatch));

    return {
      id: `rl:${rlApiMatch._id}`,
      date: rlApiMatch.date,
      matchDetails: {
        competitionName: CoreData.CompetitionName.RocketLeague,
        bo: rlApiMatch.format.length,
        games: yield* _(getGamesFromMatch(rlApiMatch)),
        players: {
          home: yield* _(getPlayersFromMatchTeam(rlApiMatch.blue)),
          away: yield* _(getPlayersFromMatchTeam(rlApiMatch.orange)),
        },
      },
      status,
      teams: [
        yield* _(getTeamDetailsFromMatch(rlApiMatch.blue, status)),
        yield* _(getTeamDetailsFromMatch(rlApiMatch.orange, status)),
      ],
      streamLink: 'kamet0', // TODO
    };
  }) satisfies Effect.Effect<CoreData.RocketLeagueMatch, any, any>;

const getGamesFromMatch = (match: OctaneApiMatch) =>
  Effect.Do.pipe(
    Effect.flatMap(() =>
      Effect.serviceFunctionEffect(OctaneApiService, (_) => _.getMatchGames)({ matchId: match._id })
    ),
    Effect.map((response) =>
      response.games.map((game) =>
        game.blue.team.stats === undefined || game.orange.team.stats === undefined ?
          undefined
        : {
            teams: {
              home: {
                goals: game.blue.team.stats.core.goals,
                stops: game.blue.team.stats.core.saves,
                totalPoints: game.blue.team.stats.core.score,
              },
              away: {
                goals: game.orange.team.stats.core.goals,
                stops: game.orange.team.stats.core.saves,
                totalPoints: game.orange.team.stats.core.score,
              },
            },
          }
      )
    )
  ) satisfies Effect.Effect<CoreData.RocketLeagueMatch['matchDetails']['games'], any, any>;

const getPlayersFromMatchTeam = (team: OctaneApiMatch['blue'] | OctaneApiMatch['orange']) =>
  Effect.Do.pipe(
    Effect.map(() => team.players.map((player) => ({ name: player.player.tag })))
  ) satisfies Effect.Effect<
    NonNullable<CoreData.RocketLeagueMatch['matchDetails']['players']>['home' | 'away'],
    any,
    any
  >;

const getStatusFromMatch = (rlApiMatch: OctaneApiMatch) =>
  Effect.Do.pipe(
    Effect.map(() =>
      rlApiMatch.blue.score + rlApiMatch.orange.score === 0 ? 'upcoming'
      : (
        [rlApiMatch.blue.score, rlApiMatch.orange.score].includes(
          Math.ceil(rlApiMatch.format.length / 2)
        )
      ) ?
        'finished'
      : 'live'
    )
  ) satisfies Effect.Effect<CoreData.RocketLeagueMatch['status'], any, any>;

const getTeamDetailsFromMatch = (
  team: OctaneApiMatch['blue'] | OctaneApiMatch['orange'],
  status: 'upcoming' | 'live' | 'finished'
) =>
  Effect.Do.pipe(
    Effect.map(() => ({
      name: team.team.team.name,
      logoUrl:
        team.team.team.image ?? 'https://medias.kametotv.fr/karmine/teams_logo/NO_TEAM_RL.png',
      score:
        status === 'upcoming' ? undefined : (
          {
            score: team.score,
            isWinner: team.winner,
            scoreType: 'gameWins',
          }
        ),
    }))
  ) satisfies Effect.Effect<CoreData.RocketLeagueMatch['teams'][0], any, any>;
