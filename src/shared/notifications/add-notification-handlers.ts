import notifee from '@notifee/react-native';
import type * as Notifee from '@notifee/react-native';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import defu from 'defu';

import { getSavedSettings } from '../utils/settings';
import { translate } from '../utils/translate';

import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';

export const addNotificationHandlers = () => {
  async function onMessageReceived(message: FirebaseMessagingTypes.RemoteMessage) {
    const rawData = message.data?.data;
    if (!rawData || typeof rawData !== 'string') return;
    // eslint-disable-next-line no-eval -- The incoming data is trusted, as it comes from the server. It is serialized using `serialize-javascript`.
    const data = eval(`(${rawData})`) as CoreData.Notifications.Notification;

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
    const { language } = await getSavedSettings();
    const matchInfos = getMatchInfosForNotification(notificationData.match);
    if (!matchInfos) return;

    const { title, body } = translate('notifications.matchStarting', language)(matchInfos);

    const notification = await getNotification({
      id: notificationData.match.id,
      title,
      body,
    });
    await notifee.displayNotification(notification);
  },
  matchScoreUpdated: async (notificationData) => {
    const { language, hideSpoilers } = await getSavedSettings();
    if (hideSpoilers) return;

    const matchInfos = getMatchInfosForNotification(notificationData.match);
    if (!matchInfos) return;

    const { title, body } = translate('notifications.matchScoreUpdated', language)(matchInfos);

    const notification = await getNotification({
      id: notificationData.match.id,
      title,
      body,
    });
    await notifee.displayNotification(notification);
  },
  matchFinished: async (notificationData) => {
    const { language, hideSpoilers } = await getSavedSettings();
    const matchInfos = getMatchInfosForNotification(notificationData.match);
    if (!matchInfos) return;

    const { title, body } = translate(
      'notifications.matchFinished',
      language
    )({
      ...matchInfos,
      showResults: !hideSpoilers,
    });

    const notification = await getNotification({
      id: notificationData.match.id,
      title,
      body,
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

function getMatchInfosForNotification(
  match: Extract<CoreData.Notifications.Notification, { match: any }>['match']
) {
  const karmineTeam = match.teams.find(
    (team) =>
      team?.name.toLowerCase().includes('karmine') || team?.name.toLowerCase().startsWith('kc')
  );

  if (!karmineTeam) {
    return null;
  }

  const opponentTeam = match.teams.find((team) => team !== karmineTeam);

  return {
    game: match.matchDetails.competitionName, // TODO: we need to format this and use the abbreviation
    karmineName: karmineTeam.name,
    karmineScore: karmineTeam.score?.score ?? 0, // TODO: this may be a "Top" score, so we need to modify this
    oldKarmineScore: 0, // TODO
    opponentName: opponentTeam?.name,
    opponentScore: opponentTeam?.score?.score ?? 0, // TODO: this may be a "Top" score, so we need to modify this
    oldOpponentScore: 0, // TODO
  };
}
