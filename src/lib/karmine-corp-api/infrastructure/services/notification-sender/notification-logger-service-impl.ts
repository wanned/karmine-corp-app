import { Effect, Console, Layer } from 'effect';

import { NotificationSenderService } from './notification-sender-service';

export const NotificationLoggerServiceImpl = Layer.succeed(
  NotificationSenderService,
  NotificationSenderService.of({
    sendNotification: ({ notification }) =>
      Effect.Do.pipe(Effect.flatMap(() => Console.log('Notification sent', notification))),
  })
);
