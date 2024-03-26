import { Console, Effect, Layer, Option, Schedule, Stream } from 'effect';

import { CoreData } from '../../application/types/core-data';
import { getSchedule } from '../../application/use-cases/get-schedule/get-schedule';
import { MatchesRepository } from '../../infrastructure/repositories/matches/matches-repository';
import { createBetterSqlite3Impl } from '../../infrastructure/services/database/better-sqlite3-impl';
import { DatabaseService } from '../../infrastructure/services/database/database-service';
import { EnvService } from '../../infrastructure/services/env/env-service';
import { FetchServiceImpl } from '../../infrastructure/services/fetch/fetch-service-impl';
import { KarmineApiServiceImpl } from '../../infrastructure/services/karmine-api/karmine-api-service-impl';
import { LeagueOfLegendsApiServiceImpl } from '../../infrastructure/services/league-of-legends-api/league-of-legends-api-service-impl';
import { NotificationLoggerServiceImpl } from '../../infrastructure/services/notification-sender/notification-logger-service-impl';
import { NotificationSenderService } from '../../infrastructure/services/notification-sender/notification-sender-service';
import { OctaneApiServiceImpl } from '../../infrastructure/services/octane-api/octane-api-service-impl';
import { StrafeApiServiceImpl } from '../../infrastructure/services/strafe-api/strafe-api-service-impl';

import { IsoDate } from '~/shared/types/IsoDate';

const notifier = () =>
  Effect.Do.pipe(
    Effect.flatMap(() =>
      Effect.serviceFunctionEffect(DatabaseService, (_) => _.initializeTables)()
    ),
    Effect.flatMap(() => MatchesRepository.getAllMatches()),
    Effect.map((matches) =>
      matches.reduce<Map<string, CoreData.Match>>((acc, match) => {
        acc.set(match.id, JSON.parse(match.data));
        return acc;
      }, new Map())
    ),
    Effect.flatMap((savedMatches) =>
      getSchedule().pipe(
        Stream.filter(
          (match): match is Exclude<typeof match, void | undefined> => match !== undefined
        ),
        Stream.filterMap<CoreData.Match, CoreData.Notifications.Notification>((match) => {
          const savedMatch = savedMatches.get(match.id);

          if (!savedMatch) {
            return Option.none();
          }

          // We want to create a notification for matches that changed status
          if (savedMatch.status !== 'finished' && match.status === 'finished') {
            return Option.some({
              type: 'matchFinished',
              match,
              createdAt: new Date().toISOString() as IsoDate,
            } satisfies CoreData.Notifications.MatchFinishedNotification);
          }

          // We want to create a notification for matches that are upcoming in less than 15 minutes
          if (
            match.status === 'upcoming' &&
            new Date(match.date).getTime() - new Date().getTime() < 15 * 60 * 1000
          ) {
            return Option.some({
              type: 'matchStarting',
              match,
              createdAt: new Date().toISOString() as IsoDate,
            } satisfies CoreData.Notifications.MatchStartingSoonNotification);
          }

          // We want to create a notification for matches that are live and have a new score
          if (
            match.status === 'live' &&
            (savedMatch.teams[0].score !== match.teams[0].score ||
              savedMatch.teams[1]?.score !== match.teams[1]?.score)
          ) {
            return Option.some({
              type: 'matchScoreUpdated',
              match,
              createdAt: new Date().toISOString() as IsoDate,
            } satisfies CoreData.Notifications.MatchScoreUpdatedNotification);
          }

          return Option.none();
        }),
        Stream.mapEffect((notification) =>
          Effect.serviceFunctionEffect(
            NotificationSenderService,
            (_) => _.sendNotification
          )({
            notification,
          })
        ),
        Stream.runDrain
      )
    )
  );

const getMainLayer = () =>
  Layer.mergeAll(
    LeagueOfLegendsApiServiceImpl,
    OctaneApiServiceImpl,
    KarmineApiServiceImpl,
    StrafeApiServiceImpl,
    FetchServiceImpl,
    NotificationLoggerServiceImpl,
    createBetterSqlite3Impl(),
    Layer.succeed(
      EnvService,
      EnvService.of({
        getEnv: () =>
          Effect.succeed({
            OCTANE_API_URL: 'https://zsr.octane.gg',
            LOL_ESPORT_API_URL: 'https://esports-api.lolesports.com/persisted/gw',
            LOL_FEED_API_URL: 'https://feed.lolesports.com/livestats/v1',
            LOL_DATA_DRAGON_API_URL: 'https://ddragon.leagueoflegends.com',
            LOL_API_KEY: '0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z',
            STRAFE_API_URL: 'https://flask-api.strafe.com',
            STRAFE_API_KEY:
              'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMDAwLCJpYXQiOjE2MTE2NTM0MzcuMzMzMDU5fQ.n9StQPQdpNIx3E4FKFntFuzKWolstKJRd-T4LwXmfmo',
            KARMINE_API_URL: 'https://api2.kametotv.fr/karmine',
            LIQUIPEDIA_PARSE_API_URL: 'https://liquipedia.net/<GAME>/api.php',
            LIQUIPEDIA_PARSE_URL_GAME_REPLACER: '<GAME>',
            YOUTUBE_API_URL: 'https://www.youtube.com',
          }),
      })
    )
  );

const notifierLoop = () =>
  Effect.repeat(
    Effect.catchAll(
      Effect.catchAllDefect(notifier(), (error) => Effect.fail(error as object)),
      (error) => Console.error(error)
    ),
    Schedule.addDelay(Schedule.forever, () => '1 minute')
  );

Effect.runPromise(Effect.provide(notifierLoop(), getMainLayer()))
  .then(console.log)
  .catch(console.error);
