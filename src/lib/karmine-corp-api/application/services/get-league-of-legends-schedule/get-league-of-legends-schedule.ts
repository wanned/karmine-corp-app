import { Data, Effect, Match, Option } from 'effect';

import { LeagueOfLegendsApi } from '~/lib/karmine-corp-api/infrastructure/services/league-of-legends-api/league-of-legends-api';
import { LeagueOfLegendsApiService } from '~/lib/karmine-corp-api/infrastructure/services/league-of-legends-api/league-of-legends-api-service';
import { StrafeApi } from '~/lib/karmine-corp-api/infrastructure/services/strafe-api/strafe-api';
import { StrafeApiService } from '~/lib/karmine-corp-api/infrastructure/services/strafe-api/strafe-api-service';
import { CoreData } from '~/shared/data/core/types';

export const getLeagueOfLegendsSchedule = () =>
  Effect.Do.pipe(
    Effect.flatMap(() => getLolMatches()),
    Effect.map((matches) => matches.flat())
  );

// The leagues come from the League of Legends API
// https://esports-api.lolesports.com/persisted/gw/getLeagues?hl=en-US
// They correspond to the leagues Karmine Corp is or could be playing in
const LOL_LEAGUES = [
  { id: '105266103462388553', slug: 'lfl', team: CoreData.CompetitionName.LeagueOfLegendsLFL },
  {
    id: '100695891328981122',
    slug: 'emea_masters',
    team: CoreData.CompetitionName.LeagueOfLegendsLFL,
  },
  { id: '98767991302996019', slug: 'lec', team: CoreData.CompetitionName.LeagueOfLegendsLEC },
  { id: '110988878756156222', slug: 'wqs', team: CoreData.CompetitionName.LeagueOfLegendsLEC },
  { id: '98767991325878492', slug: 'msi', team: CoreData.CompetitionName.LeagueOfLegendsLEC },
  { id: '98767975604431411', slug: 'worlds', team: CoreData.CompetitionName.LeagueOfLegendsLEC },
] as const;

const getLolMatches = () =>
  Effect.forEach(LOL_LEAGUES, ({ id }) => getLolMatchesInLeague(id), {
    concurrency: 3,
  });

const getLolMatchesInLeague = (leagueId: string) =>
  Effect.Do.pipe(
    Effect.bind('leagueOfLegendsApiService', () => LeagueOfLegendsApiService),
    Effect.flatMap(({ leagueOfLegendsApiService }) =>
      Effect.iterate([] as LeagueOfLegendsApi.GetSchedule['data']['schedule'][], {
        while: (matches) =>
          matches.length === 0 ||
          (matches.at(-1)!.pages.older !== null && matches.at(-1)!.pages.older !== undefined),
        body: (matches) =>
          leagueOfLegendsApiService
            .getSchedule({
              leagueIds: [leagueId],
              pageToken: matches.at(-1)?.pages.older ?? undefined,
            })
            .pipe(Effect.map((newMatches) => [...matches, newMatches.data.schedule])),
      })
    ),
    Effect.map((matches) => matches.flatMap((match) => match.events.filter(isKarmineMatch))),
    Effect.flatMap((matches) =>
      Effect.forEach(matches, getCoreMatch, {
        concurrency: 10,
      })
    )
  );

const isKarmineMatch = (
  match: LeagueOfLegendsApi.GetSchedule['data']['schedule']['events'][number]
) => match.match.teams.some((team) => team.name.toLowerCase().includes('karmine'));

const getStrafeMatch = (
  leagueOfLegendsMatch: LeagueOfLegendsApi.GetSchedule['data']['schedule']['events'][number]
) =>
  Effect.gen(function* (_) {
    const karmineTeam = leagueOfLegendsMatch.match.teams.find((team) =>
      team.name.toLowerCase().includes('karmine')
    );
    if (karmineTeam === undefined) return undefined;

    const strafeApiService = yield* _(StrafeApiService);

    const strafeMatches = yield* _(
      strafeApiService.getCalendar({
        date: leagueOfLegendsMatch.startTime,
      })
    );

    const strafeMatch = strafeMatches.data?.find((strafeMatch) =>
      [strafeMatch.home?.name, strafeMatch.away?.name].includes(karmineTeam.name)
    );

    return strafeMatch;
  });

const getCoreMatch = (
  leagueOfLegendsMatch: LeagueOfLegendsApi.GetSchedule['data']['schedule']['events'][number]
) =>
  Effect.Do.pipe(
    Effect.bind('status', () => getCoreStatus(leagueOfLegendsMatch.state)),
    Effect.bind('streamLink', () => Effect.succeed('kamet0')),
    Effect.bind('teams', () => getTeamsFromEvent(leagueOfLegendsMatch)),
    Effect.bind('matchDetails', () => getMatchDetailsFromEvent(leagueOfLegendsMatch)),
    Effect.map(({ status, streamLink, teams, matchDetails }) => ({
      id: `lol:${leagueOfLegendsMatch.match.id}`,
      date: leagueOfLegendsMatch.startTime,
      matchDetails,
      status,
      streamLink,
      teams,
    }))
  ) satisfies Effect.Effect<CoreData.LeagueOfLegendsMatch, any, any>;

type StatusMapping = {
  completed: 'finished';
  finished: 'finished';
  in_game: 'live';
  inProgress: 'live';
  live: 'live';
  unstarted: 'upcoming';
};

const getCoreStatus = <
  T extends 'completed' | 'finished' | 'in_game' | 'inProgress' | 'live' | 'unstarted',
>(
  status: T
) =>
  Effect.succeed(
    Match.value(
      status as 'completed' | 'finished' | 'in_game' | 'inProgress' | 'live' | 'unstarted'
    ).pipe(
      Match.when('finished', () => 'finished' as const),
      Match.when('completed', () => 'finished' as const),
      Match.when('live', () => 'live' as const),
      Match.when('inProgress', () => 'live' as const),
      Match.when('in_game', () => 'live' as const),
      Match.when('unstarted', () => 'upcoming' as const),
      Match.exhaustive
    )
  ) as Effect.Effect<StatusMapping[T]>;

class LeagueNotFound extends Data.Error {
  public readonly message = 'League not found';
}

class StrafeMatchNotFound extends Data.Error {
  public readonly message = 'Strafe match not found';
}

const getMatchDetailsFromEvent = (
  leagueOfLegendsMatch: LeagueOfLegendsApi.GetSchedule['data']['schedule']['events'][number]
) =>
  Effect.gen(function* (_) {
    const league = LOL_LEAGUES.find((league) => league.slug === leagueOfLegendsMatch.league.slug);
    if (league === undefined) return yield* _(Effect.fail(new LeagueNotFound()));

    const strafeApiService = yield* _(StrafeApiService);
    const strafeMatch = yield* _(getStrafeMatch(leagueOfLegendsMatch));
    if (strafeMatch === undefined) return yield* _(Effect.fail(new StrafeMatchNotFound()));
    const strafeMatchDetails = yield* _(strafeApiService.getMatch({ matchId: strafeMatch.id }));

    const leagueOfLegendsApiService = yield* _(LeagueOfLegendsApiService);
    const lolEsportMatchDetails = yield* _(
      leagueOfLegendsApiService.getMatch({
        matchId: leagueOfLegendsMatch.match.id,
      })
    );

    const playersMap = new Map<string, CoreData.Player & { team: 'home' | 'away' }>();

    const games = yield* _(
      Effect.forEach(
        lolEsportMatchDetails.data.event.match.games.sort((a, b) => a.number - b.number),
        (lolGame) =>
          getGameDetailsFromEvent({
            lolEsportMatchDetails,
            strafeMatchDetails,
            gameNumber: lolGame.number,
            startTime: leagueOfLegendsMatch.startTime,
            playersMap,
          }).pipe(
            Effect.catchSome((error) =>
              error instanceof LastFrameNotFound ?
                Option.some(Effect.succeed(undefined))
              : Option.none()
            )
          ),
        {
          concurrency: 'unbounded',
        }
      ).pipe(Effect.map((games) => games.filter(Boolean)))
    );

    const players: CoreData.LeagueOfLegendsMatch['matchDetails']['players'] = {
      home: [],
      away: [],
    };
    playersMap.forEach(({ team, ...player }) => players[team].push(player));

    return {
      competitionName: league.team,
      bo: leagueOfLegendsMatch.match.strategy.count,
      games,
      players,
    };
  }) satisfies Effect.Effect<CoreData.LeagueOfLegendsMatch['matchDetails'], any, any>;

class GameNotFound extends Data.Error {
  public readonly message = 'Game not found';
}

class LastFrameNotFound extends Data.Error {
  public readonly message: string;

  constructor(gameId: string) {
    super();
    this.message = `Last frame not found for game ${gameId}`;
  }
}

class TeamNotFound extends Data.Error {
  public readonly message: string;

  constructor(readonly team: string) {
    super();
    this.message = `Team ${team} not found`;
  }
}

const getGameDetailsFromEvent = ({
  lolEsportMatchDetails,
  strafeMatchDetails,
  gameNumber,
  startTime,
  playersMap,
}: {
  lolEsportMatchDetails: LeagueOfLegendsApi.GetMatch;
  strafeMatchDetails: StrafeApi.GetMatch;
  gameNumber: number;
  startTime: Date;
  playersMap: Map<string, CoreData.Player & { team: 'home' | 'away' }>;
}) =>
  Effect.gen(function* (_) {
    const lolGame = lolEsportMatchDetails.data.event.match.games.find(
      (game) => game.number === gameNumber
    );
    if (lolGame === undefined) return yield* _(Effect.fail(new GameNotFound()));

    const strafeGameDetails = strafeMatchDetails.data.live.find(
      (game) => game.data.index === gameNumber - 1
    );

    const lolGameDetails = yield* _(getLastGameWindow(lolGame.id, startTime));
    const lastFrame = lolGameDetails?.frames.at(-1);
    if (lastFrame === undefined) return yield* _(Effect.fail(new LastFrameNotFound(lolGame.id)));

    const firstGame = lolEsportMatchDetails.data.event.match.games[0];
    const homeTeam = firstGame.teams.find((team) => team.side === 'blue');
    if (homeTeam === undefined) return yield* _(Effect.fail(new TeamNotFound('blue')));

    const homeColor = lolGame.teams.find((team) => team.id === homeTeam.id)?.side;
    if (homeColor === undefined) return yield* _(Effect.fail(new TeamNotFound('blue')));
    const awayColor = homeColor === 'blue' ? 'red' : 'blue';

    if (gameNumber !== 1) {
      // If we are not in the first game, we do not want to add players to the map.
      // We only want to add players from the first game.
      // This is because this function is called in a Promise.all, so if there is multiple games,
      // where the teams are not the same side between the games, the players could all be added
      // to the home team, or all to the away team.
      playersMap = new Map();
    }

    return {
      status: yield* _(getCoreStatus(lastFrame.gameState === 'paused' ? 'finished' : 'live')),
      score: {
        home: lastFrame[`${homeColor}Team`].totalKills,
        away: lastFrame[`${awayColor}Team`].totalKills,
      },
      draft: {
        home: {
          picks: yield* _(
            getTeamPicks({
              side: homeColor,
              lolGameDetails,
              playersMap,
              team: 'home',
            })
          ),
        },
        away: {
          picks: yield* _(
            getTeamPicks({
              side: awayColor,
              lolGameDetails,
              playersMap,
              team: 'away',
            })
          ),
        },
      },
      duration: strafeGameDetails?.data.game.duration,
      winnerTeam: strafeGameDetails?.data.winner ?? undefined,
    };
  }) satisfies Effect.Effect<
    CoreData.LeagueOfLegendsMatch['matchDetails']['games'][number],
    any,
    any
  >;

const getTeamPicks = ({
  side,
  lolGameDetails,
  playersMap,
  team,
}: {
  side: 'blue' | 'red';
  lolGameDetails: LeagueOfLegendsApi.GetGameWindow;
  playersMap: Map<string, CoreData.Player & { team: 'home' | 'away' }>;
  team: 'home' | 'away';
}) =>
  Effect.Do.pipe(
    Effect.flatMap(() => getAllPlayers()),
    Effect.flatMap((allWorldPlayers) =>
      Effect.forEach(
        lolGameDetails?.gameMetadata[`${side}TeamMetadata`].participantMetadata ?? [],
        (participant) =>
          Effect.gen(function* (_) {
            if (!playersMap.has(participant.summonerName)) {
              playersMap.set(participant.summonerName, {
                name: participant.summonerName,
                imageUrl:
                  participant.esportsPlayerId !== undefined ?
                    allWorldPlayers.find((player) => player.id === participant.esportsPlayerId)
                      ?.image
                  : undefined,
                role: participant.role,
                team,
              });
            }

            return {
              champion: {
                name: participant.championId,
                imageUrl: yield* _(getChampionImageUrl(participant.championId)),
              },
              player: participant.summonerName,
            };
          }),
        {
          concurrency: 'unbounded',
        }
      )
    )
  );

const getChampionImageUrl = (championId: string) =>
  Effect.Do.pipe(
    Effect.flatMap(() => LeagueOfLegendsApiService),
    Effect.flatMap((leagueOfLegendsApiService) => leagueOfLegendsApiService.getVersions()),
    Effect.map((versions) => versions[0]),
    Effect.map(
      (lastGameVersion) =>
        `https://ddragon.leagueoflegends.com/cdn/${lastGameVersion}/img/champion/${championId}.png`
    )
  );

const getAllPlayers = () =>
  Effect.Do.pipe(
    Effect.flatMap(() => LeagueOfLegendsApiService),
    Effect.flatMap((leagueOfLegendsApiService) => leagueOfLegendsApiService.getTeams()),
    Effect.map((teams) => teams.data.teams.flatMap((team) => team.players))
  );

const getLastGameWindow = (gameId: string, eventStartDate: Date) =>
  Effect.Do.pipe(
    Effect.map(() => {
      const year = eventStartDate.getFullYear();
      const maxWindowDate = new Date(`${year}-12-31T23:59:50.000Z`);

      // disallowed window with end time less than 45 sec old
      // So we should get the current date and remove 55 sec, then round to the nearest 10 sec below
      // Then we should compare the date with the last window date and get the minimum
      const currentMinus55Sec = new Date(new Date().getTime() - 55 * 1000);
      const currentMinus55SecRounded = new Date(
        Math.floor(currentMinus55Sec.getTime() / 10000) * 10000
      );

      return {
        currentMinus55SecRounded,
        maxWindowDate,
      };
    }),
    Effect.map(
      ({ currentMinus55SecRounded, maxWindowDate }) =>
        new Date(Math.min(currentMinus55SecRounded.getTime(), maxWindowDate.getTime()))
    ),
    Effect.map((lastWindowDate) => ({
      gameId,
      startingTime: lastWindowDate,
    })),
    Effect.bind('leagueOfLegendsApiService', () => LeagueOfLegendsApiService),
    Effect.flatMap(({ gameId, startingTime, leagueOfLegendsApiService }) =>
      leagueOfLegendsApiService.getGameWindow({ gameId, startingTime })
    )
  );

const getTeamsFromEvent = (
  leagueOfLegendsMatch: LeagueOfLegendsApi.GetSchedule['data']['schedule']['events'][number]
) =>
  Effect.forEach(
    leagueOfLegendsMatch.match.teams,
    (team) =>
      Effect.succeed({
        name: team.name,
        logoUrl: team.image.replace('http:', 'https:'),
        score:
          team.result !== null && team.result.outcome !== null ?
            {
              score: team.result.gameWins,
              scoreType: 'gameWins',
              isWinner: team.result.outcome === 'win',
            }
          : undefined,
      }),
    {
      concurrency: 'unbounded',
    }
  ) as Effect.Effect<CoreData.LeagueOfLegendsMatch['teams']>;
