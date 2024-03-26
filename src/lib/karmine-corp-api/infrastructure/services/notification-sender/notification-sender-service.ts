import { Context, Effect } from 'effect';

import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';

const NOTIFICATION_SENDER_SERVICE_TAG = 'NotificationSenderService';

export class NotificationSenderService extends Context.Tag(NOTIFICATION_SENDER_SERVICE_TAG)<
  NotificationSenderService,
  {
    sendNotification(args: {
      notification: CoreData.Notifications.Notification;
    }): Effect.Effect<void, never, never>;
  }
>() {}
