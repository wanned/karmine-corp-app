import notifee from '@notifee/react-native';
import type * as Notifee from '@notifee/react-native';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import defu from 'defu';

import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';

export const addNotificationHandlers = () => {
  async function onMessageReceived(message: FirebaseMessagingTypes.RemoteMessage) {
    const data = message.data as unknown as CoreData.Notifications.Notification;

    const handler = notificationHandlers[data.type];
    if (handler) {
      await handler(data as any);
    }
  }

  messaging().onMessage(onMessageReceived);
  messaging().setBackgroundMessageHandler(onMessageReceived);
};

const notificationHandlers: {
  [K in CoreData.Notifications.Notification['type']]: (
    notification: Extract<CoreData.Notifications.Notification, { type: K }>
  ) => Promise<void>;
} = {
  matchStarting: async (notificationData) => {
    const notification = await getNotification({
      id: notificationData.match.id,
      title: 'TODO',
      body: 'TODO',
    });
    await notifee.displayNotification(notification);
  },
  matchScoreUpdated: async (notificationData) => {
    const notification = await getNotification({
      id: notificationData.match.id,
      title: 'TODO',
      body: 'TODO',
    });
    await notifee.displayNotification(notification);
  },
  matchFinished: async (notificationData) => {
    const notification = await getNotification({
      id: notificationData.match.id,
      title: 'TODO',
      body: 'TODO',
    });
    await notifee.displayNotification(notification);
  },
};

async function runPrerequisites() {
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  return { channelId };
}

async function getNotification(notification: { id: string; title: string; body: string }) {
  const { channelId } = await runPrerequisites();

  return defu<Notifee.Notification, [typeof notification]>(
    {
      android: {
        channelId,
      },
    },
    notification
  );
}
