// To send a test notification, run `bun src/lib/karmine-corp-api/adapters/notifier/send-test-notification.ts`.

import { Effect, Layer } from 'effect';

import { CoreData } from '../../application/types/core-data';
import { createEnvServiceImpl } from '../../infrastructure/services/env/env-service-impl';
import { NotificationFcmServiceImpl } from '../../infrastructure/services/notification-sender/notification-fcm-service-impl';
import { NotificationSenderService } from '../../infrastructure/services/notification-sender/notification-sender-service';

import { IsoDate } from '~/shared/types/IsoDate';

const sendTestNotification = () =>
  Effect.serviceFunctionEffect(
    NotificationSenderService,
    (_) => _.sendNotification
  )({
    notification: {
      type: 'matchStarting',
      createdAt: new Date().toISOString() as IsoDate,
      match: {
        id: 'all:test_0001',
        matchDetails: {
          competitionName: CoreData.CompetitionName.LeagueOfLegendsLEC,
        },
        teams: [
          {
            name: 'Karmine Corp',
          },
          {
            name: 'Test',
          },
        ],
      },
    },
  });

Effect.runPromise(
  Effect.provide(
    sendTestNotification(),
    createEnvServiceImpl({ firebaseEnvShouldBeDefined: true }).pipe((layer) =>
      Layer.merge(Layer.provide(NotificationFcmServiceImpl, layer), layer)
    )
  )
)
  .then(console.log)
  .catch(console.error);
