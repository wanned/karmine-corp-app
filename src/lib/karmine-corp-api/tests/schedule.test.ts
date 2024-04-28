import { it, describe, beforeAll, expect, afterAll } from '@effect/vitest';
import { Effect, Layer, Stream, Sink } from 'effect';
import fs from 'fs';

import { CoreData } from '../application/types/core-data';
import { getSchedule } from '../application/use-cases/get-schedule/get-schedule';
import { GetScheduleParamsState } from '../application/use-cases/get-schedule/get-schedule-params-state';
import { createBetterSqlite3Impl } from '../infrastructure/services/database/better-sqlite3-impl';
import { DatabaseService } from '../infrastructure/services/database/database-service';
import { createEnvServiceImpl } from '../infrastructure/services/env/env-service-impl';
import { FetchServiceImpl } from '../infrastructure/services/fetch/fetch-service-impl';
import { KarmineApiServiceImpl } from '../infrastructure/services/karmine-api/karmine-api-service-impl';
import { LeagueOfLegendsApiServiceImpl } from '../infrastructure/services/league-of-legends-api/league-of-legends-api-service-impl';
import { LiquipediaParseApiServiceImpl } from '../infrastructure/services/liquipedia-parse-api/liquipedia-parse-api-service-impl';
import { NotificationFcmServiceImpl } from '../infrastructure/services/notification-sender/notification-fcm-service-impl';
import { OctaneApiServiceImpl } from '../infrastructure/services/octane-api/octane-api-service-impl';
import { StrafeApiServiceImpl } from '../infrastructure/services/strafe-api/strafe-api-service-impl';

describe('schedule', () => {
  const schedule: CoreData.Match[] = [];

  beforeAll(
    async () => {
      await Effect.runPromise(
        Effect.provide(
          Stream.run(
            getSchedule().pipe(
              Stream.filter(
                (schedule): schedule is Exclude<typeof schedule, undefined | void> =>
                  schedule !== undefined
              )
            ),
            Sink.forEach((match) => Effect.sync(() => schedule.push(match)))
          ),
          getMainLayer()
        )
      );

      console.log(`Loaded ${schedule.length} matches`);
    },
    600_000 // We set a timeout of 10 minutes as the schedule can be quite large
  );

  afterAll(async ({ result }) => {
    const haveErrors = (result?.errors ?? []).length > 0;

    if (haveErrors) {
      const filename = `./schedule-${new Date().toISOString()}.json`;

      fs.writeFileSync(filename, JSON.stringify(schedule, null, 2));
      console.log(`Schedule saved to ${filename}`);
    }
  });

  it('should not contain any non-https URLs', () => {
    const urls = JSON.stringify(schedule).matchAll(/https?:\/\/[^"]+/g);
    for (const url of urls) {
      expect(url[0]).toMatch(/^https/);
    }
  });

  describe('league of legends', () => {
    const leagueOfLegendsSchedule = schedule.filter((match) =>
      [
        CoreData.CompetitionName.LeagueOfLegendsLEC,
        CoreData.CompetitionName.LeagueOfLegendsLFL,
      ].includes(match.matchDetails.competitionName)
    );

    it('should have no duplicated players', () => {
      const players = leagueOfLegendsSchedule
        .map((match) => Object.values(match.matchDetails.players ?? {}))
        .flat(2);
      const playerNames = players.map((player) => player.name);
      const uniquePlayerNames = new Set(playerNames);
      expect(playerNames.length).toBe(uniquePlayerNames.size);
    });

    it('should have players assigned to the correct teams', () => {
      // We will test only Karmine Corp players, as if they are assigned correctly, the other teams should be too

      for (const match of leagueOfLegendsSchedule) {
        const karmineTeamSide =
          match.teams.findIndex((team) => team?.name.toLowerCase().includes('karmine')) === 0 ?
            'home'
          : 'away';
        const opponentTeamSide = karmineTeamSide === 'home' ? 'away' : 'home';

        for (const player of Object.values(match.matchDetails.players?.[karmineTeamSide] ?? {})) {
          expect(
            player.name,
            `Player ${player.name} in match ${match.id} and team ${karmineTeamSide} is from Karmine Corp`
          ).toMatch(/^KCB? /);
        }

        for (const player of Object.values(match.matchDetails.players?.[opponentTeamSide] ?? {})) {
          expect(
            player.name,
            `Player ${player.name} in match ${match.id} and team ${opponentTeamSide} is not from Karmine Corp`
          ).not.toMatch(/^KCB? /);
        }
      }
    });
  });
});

function getMainLayer() {
  return Layer.empty.pipe(
    Layer.merge(LeagueOfLegendsApiServiceImpl),
    Layer.merge(OctaneApiServiceImpl),
    Layer.merge(KarmineApiServiceImpl),
    Layer.merge(StrafeApiServiceImpl),
    Layer.merge(LiquipediaParseApiServiceImpl),
    Layer.merge(FetchServiceImpl),
    Layer.merge(
      Layer.provideMerge(
        Layer.effectDiscard(
          Effect.Do.pipe(
            Effect.flatMap(() => Effect.flatMap(DatabaseService, (_) => _.initializeTables())),
            Effect.map(() => Layer.empty)
          )
        ),
        createBetterSqlite3Impl()
      )
    ),
    Layer.merge(createEnvServiceImpl()),
    Layer.merge(Layer.succeed(GetScheduleParamsState, GetScheduleParamsState.of({}))),
    (layer) => Layer.merge(Layer.provide(NotificationFcmServiceImpl, layer), layer)
  );
}
