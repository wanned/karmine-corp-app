import * as Notifications from 'expo-notifications';

import { formatNotification, Notification } from './notification';
import { notificationsStorage } from './notifications-storage';

export const cancelNotification = async (id: string) => {
  await Notifications.cancelScheduledNotificationAsync(id);
  await notificationsStorage.removeNotification(id);
};

export const updateNotification = async (notification: Notification) => {
  await scheduleNotification(notification);
};

export const scheduleNotification = async (notification: Notification) => {
  const notificationId = await Notifications.scheduleNotificationAsync({
    identifier: notification.id,
    content: await formatNotification(notification),
    trigger: notification.at,
  });

  await notificationsStorage.setNotification(notificationId, notification);
};
