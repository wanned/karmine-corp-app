import { Data, Effect, Option, Cache } from 'effect';

import { addPlayer } from './players-ref';
import { convertToCoreStatus } from '../utils/convert-to-core-status';

import { LeagueOfLegendsApi } from '~/lib/karmine-corp-api/infrastructure/services/league-of-legends-api/league-of-legends-api';
import { LeagueOfLegendsApiService } from '~/lib/karmine-corp-api/infrastructure/services/league-of-legends-api/league-of-legends-api-service';
import { StrafeApiService } from '~/lib/karmine-corp-api/infrastructure/services/strafe-api/strafe-api-service';
import { optionGetOrFail } from '~/lib/karmine-corp-api/infrastructure/utils/effect/option-get-or-fail';

type LeagueOfLegendsMatch = LeagueOfLegendsApi.GetMatch;
type LeagueOfLegendsGame = LeagueOfLegendsMatch['data']['event']['match']['games'][number];

interface GetGameDetailsParams extends LeagueOfLegendsGame {
  match: LeagueOfLegendsMatch;
  startTime: Date;
}

class LastFrameNotFound extends Data.TaggedError('LastFrameNotFound') {}
class TeamNotFound extends Data.TaggedError('TeamNotFound')<{
  side: string;
}> {}
export function getGameDetails({ match, startTime, ...game }: GetGameDetailsParams) {
  return Effect.Do.pipe(
    Effect.flatMap(() => getGameLastWindow(game.id, startTime)),
    Effect.flatMap((lastWindow) =>
      Effect.all({
        lastFrame: optionGetOrFail(
          Option.fromNullable(lastWindow?.frames.at(-1)),
          new LastFrameNotFound()
        ),
        lastWindow: Effect.succeed(lastWindow),
      })
    ),
    Effect.flatMap(({ lastFrame, lastWindow }) =>
      Effect.all({
        lastFrame: Effect.succeed(lastFrame),
        lastWindow: Effect.succeed(lastWindow),
        homeColor: optionGetOrFail(
          Option.fromNullable(
            game.teams.find((team) => team.id === match.data.event.match.teams[0].id)?.side
          ),
          new TeamNotFound({ side: 'home' })
        ),
        awayColor: optionGetOrFail(
          Option.fromNullable(
            game.teams.find((team) => team.id === match.data.event.match.teams[1].id)?.side
          ),
          new TeamNotFound({ side: 'away' })
        ),
      })
    ),
    Effect.flatMap(({ lastFrame, lastWindow, homeColor, awayColor }) =>
      Effect.all({
        status: convertToCoreStatus(
          lastFrame.gameState === 'paused' ? 'finished' : lastFrame.gameState
        ),
        score: Effect.succeed({
          home: lastFrame[`${homeColor}Team`].totalKills,
          away: lastFrame[`${awayColor}Team`].totalKills,
        }),
        draft: Effect.all({
          home: Effect.all({
            picks: getTeamPicks({ lastWindow, team: homeColor }),
          }),
          away: Effect.all({
            picks: getTeamPicks({ lastWindow, team: awayColor }),
          }),
        }),
        duration: getStrafeGameDetails({
          gameNumber: game.number,
          match,
          startTime,
        }).pipe(Effect.map((strafeGame) => strafeGame?.data.game.duration)),
        winnerTeam: getStrafeGameDetails({
          gameNumber: game.number,
          match,
          startTime,
        }).pipe(Effect.map((strafeGame) => strafeGame?.data.winner ?? undefined)),
      })
    )
  );
}

function getGameLastWindow(gameId: string, eventStartDate: Date) {
  return Effect.Do.pipe(
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
    Effect.flatMap(({ gameId, startingTime }) =>
      Effect.serviceMembers(LeagueOfLegendsApiService).functions.getGameWindow({
        gameId,
        startingTime,
      })
    )
  );
}

function getTeamPicks({
  lastWindow,
  team,
}: {
  lastWindow: LeagueOfLegendsApi.GetGameWindow;
  team: 'blue' | 'red';
}) {
  return Effect.forEach(
    lastWindow?.gameMetadata[`${team}TeamMetadata`].participantMetadata ?? [],
    (participant) =>
      Effect.Do.pipe(
        Effect.tap(() =>
          addPlayer(
            team === 'blue' ? 'home' : 'away',
            Effect.all({
              name: Effect.succeed(participant.summonerName),
              imageUrl: getAllPlayers().pipe(
                Effect.map((players) =>
                  players.find((player) => player.id === participant.esportsPlayerId)
                ),
                Effect.map((player) => player?.image)
              ),
              role: Effect.succeed(participant.role),
            })
          )
        ),
        Effect.flatMap(() =>
          Effect.all({
            champion: Effect.all({
              name: Effect.succeed(participant.championId),
              imageUrl: getChampionImageUrl(participant.championId),
            }),
            player: Effect.succeed(participant.summonerName),
          })
        )
      )
  );
}

// Using the Cache.make function for allPlayers makes the app very slow, so we use a global variable instead
let allPlayers: LeagueOfLegendsApi.GetTeams['data']['teams'][0]['players'] | undefined;
function getAllPlayers() {
  return Effect.if(Effect.succeed(allPlayers !== undefined), {
    onTrue: Effect.succeed(allPlayers!),
    onFalse: Effect.serviceMembers(LeagueOfLegendsApiService)
      .functions.getTeams()
      .pipe(
        Effect.tap((teams) => (allPlayers = teams.data.teams.flatMap((team) => team.players))),
        Effect.map((teams) => teams.data.teams.flatMap((team) => team.players))
      ),
  });
}

function getChampionImageUrl(championId: string) {
  return Effect.Do.pipe(
    Effect.flatMap(() => Effect.serviceMembers(LeagueOfLegendsApiService).functions.getVersions()),
    Effect.map((versions) => versions[0]),
    Effect.map(
      (lastGameVersion) =>
        `https://ddragon.leagueoflegends.com/cdn/${lastGameVersion}/img/champion/${championId}.png`
    )
  );
}

function getStrafeGameDetails({
  gameNumber,
  ...paramsForGetStrafeMatch
}: Parameters<typeof getStrafeMatch>[0] & { gameNumber: number }) {
  return getStrafeMatchCached.pipe(
    Effect.flatMap((strafeMatchCache) => strafeMatchCache.get(paramsForGetStrafeMatch)),
    Effect.map((strafeMatch) =>
      strafeMatch.data.live.find((game) => game.data.index === gameNumber - 1)
    )
  );
}

const getStrafeMatchCached = Cache.make({
  capacity: 100,
  timeToLive: '1 minute',
  lookup: getStrafeMatch,
});

class StrafeMatchNotFound extends Data.TaggedError('StrafeMatchNotFound') {}
function getStrafeMatch({ match, startTime }: Pick<GetGameDetailsParams, 'match' | 'startTime'>) {
  return Effect.Do.pipe(
    Effect.map(() =>
      match.data.event.match.teams.find((team) => team.name.toLowerCase().includes('karmine'))
    ),
    Effect.map(Option.fromNullable),
    Effect.flatMap(optionGetOrFail(new StrafeMatchNotFound())),
    Effect.flatMap((team) =>
      Effect.all({
        calendar: Effect.serviceMembers(StrafeApiService).functions.getCalendar({
          date: startTime,
        }),
        team: Effect.succeed(team),
      })
    ),
    Effect.map(
      ({ calendar, team }) =>
        calendar.data?.find((strafeMatch) =>
          [strafeMatch.home?.name, strafeMatch.away?.name].includes(team.name)
        )
    ),
    Effect.map(Option.fromNullable),
    Effect.flatMap(optionGetOrFail(new StrafeMatchNotFound())),
    Effect.flatMap((strafeMatch) =>
      Effect.serviceMembers(StrafeApiService).functions.getMatch({
        matchId: strafeMatch.id,
      })
    )
  );
}
