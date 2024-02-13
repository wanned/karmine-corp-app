import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { useEffect } from 'react';

import { Notification } from './notifications/notification';
import { requestNotificationPermissions } from './notifications/notification-permissions';
import { scheduleNotification } from './notifications/notifications';
import { DataFetcher } from '../data/core/data-fetcher';
import { CoreData } from '../data/core/types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const NOTIFICATIONS_BACKGROUND_FETCH_TASK = 'notifications-background-fetch-task';
const defineNotificationsBackgroundFetchTask = () => {
  TaskManager.defineTask(NOTIFICATIONS_BACKGROUND_FETCH_TASK, async () => {
    scheduleNotifications();

    return BackgroundFetch.BackgroundFetchResult.NewData;
  });
};

const scheduleNotifications = async () => {
  const dataFetcher = new DataFetcher();

  const now = Date.now();

  const DAY_IN_MS = 1000 * 60 * 60 * 24;

  const matches = await dataFetcher.getSchedule({
    filters: {
      date: {
        from: new Date(now),
        to: new Date(now + 3 * DAY_IN_MS),
      },
    },
  });

  const notifications = matches.map(matchToNotification);
  // notifications.forEach(scheduleNotification);
  notifications.forEach((notification) =>
    scheduleNotification({ ...notification, at: new Date(now + 10000) })
  );
};

const registerNotifications = async () => {
  scheduleNotifications();

  requestNotificationPermissions();

  const isTaskDefined = TaskManager.isTaskDefined(NOTIFICATIONS_BACKGROUND_FETCH_TASK);

  if (!isTaskDefined) {
    defineNotificationsBackgroundFetchTask();
  }

  const isRegistered = await TaskManager.isTaskRegisteredAsync(NOTIFICATIONS_BACKGROUND_FETCH_TASK);

  if (!isRegistered) {
    await BackgroundFetch.registerTaskAsync(NOTIFICATIONS_BACKGROUND_FETCH_TASK, {
      minimumInterval: 60 * 15,
      stopOnTerminate: false,
      startOnBoot: true,
    });
  }
};

const matchToNotification = (match: CoreData.Match): Notification => {
  return {
    type: 'match',
    id: match.id,
    at: new Date(match.date),
    teamName: match.matchDetails.competitionName,
    // TODO: Add opponent name
  };
};

export const useRegisterNotifications = () => {
  useEffect(() => {
    registerNotifications();
  }, []);
};
