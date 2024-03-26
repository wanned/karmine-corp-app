import { Effect, Layer } from 'effect';
import { initializeApp, credential, messaging } from 'firebase-admin';
import serializeJavascript from 'serialize-javascript';

import { NotificationSenderService } from './notification-sender-service';
import { EnvService } from '../env/env-service';

const APP_TOPIC = '*';

export const NotificationFcmServiceImpl = Layer.effect(
  NotificationSenderService,
  Effect.Do.pipe(
    Effect.flatMap(() => Effect.serviceFunctionEffect(EnvService, (_) => _.getEnv)()),
    Effect.map((env) =>
      initializeApp({
        credential: credential.cert({
          clientEmail: env.FIREBASE_CLIENT_EMAIL,
          privateKey: env.FIREBASE_PRIVATE_KEY,
          projectId: env.FIREBASE_PROJECT_ID,
        }),
      })
    ),
    Effect.map((app) =>
      NotificationSenderService.of({
        sendNotification: ({ notification }) => {
          const message: messaging.MessagingPayload = {
            data: { data: serializeJavascript(notification) },
          };
          return Effect.promise(() => app.messaging().sendToTopic(APP_TOPIC, message));
        },
      })
    )
  )
);
