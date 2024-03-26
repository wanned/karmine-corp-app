import { Console, Effect, Layer, Option, Schedule, Stream } from 'effect';

import { CoreData } from '../../application/types/core-data';
import { getSchedule } from '../../application/use-cases/get-schedule/get-schedule';
import { MatchesRepository } from '../../infrastructure/repositories/matches/matches-repository';
import { createBetterSqlite3Impl } from '../../infrastructure/services/database/better-sqlite3-impl';
import { DatabaseService } from '../../infrastructure/services/database/database-service';
import { createEnvServiceImpl } from '../../infrastructure/services/env/env-service-impl';
import { FetchServiceImpl } from '../../infrastructure/services/fetch/fetch-service-impl';
import { KarmineApiServiceImpl } from '../../infrastructure/services/karmine-api/karmine-api-service-impl';
import { LeagueOfLegendsApiServiceImpl } from '../../infrastructure/services/league-of-legends-api/league-of-legends-api-service-impl';
import { NotificationFcmServiceImpl } from '../../infrastructure/services/notification-sender/notification-fcm-service-impl';
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
  Layer.empty.pipe(
    Layer.merge(LeagueOfLegendsApiServiceImpl),
    Layer.merge(OctaneApiServiceImpl),
    Layer.merge(KarmineApiServiceImpl),
    Layer.merge(StrafeApiServiceImpl),
    Layer.merge(FetchServiceImpl),
    Layer.merge(createBetterSqlite3Impl()),
    Layer.merge(createEnvServiceImpl({ firebaseEnvShouldBeDefined: true })),
    (layer) => Layer.merge(Layer.provide(NotificationFcmServiceImpl, layer), layer)
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
