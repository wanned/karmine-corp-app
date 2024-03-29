import notifee from '@notifee/react-native';
import type * as Notifee from '@notifee/react-native';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import defu from 'defu';

import { getSettings } from '../utils/settings';
import { translate } from '../utils/translate';

import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';

export const addBackgroundNotificationHandlers = () => {
  messaging().setBackgroundMessageHandler(onMessageReceived);
};

export const addForegroundNotificationHandlers = () => {
  messaging().onMessage(onMessageReceived);
};

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

const notificationHandlers: {
  [K in CoreData.Notifications.Notification['type']]: (
    notification: Extract<CoreData.Notifications.Notification, { type: K }>
  ) => Promise<void>;
} = {
  matchStarting: async (notificationData) => {
    const { language, notifications: notificationsSettings } = await getSettings();
    if (!notificationsSettings[notificationData.match.matchDetails.competitionName]) return;
    const matchInfos = getMatchInfosForNotification(notificationData);
    if (!matchInfos) return;

    const { title, body } = translate('notifications.matchStarting', language)[0](matchInfos);

    const notification = await getNotification({
      id: notificationData.match.id,
      title,
      body,
    });
    await notifee.displayNotification(notification);
  },
  matchScoreUpdated: async (notificationData) => {
    const settings = await getSettings();
    const { language, showResults, notifications: notificationsSettings } = settings;
    if (!notificationsSettings[notificationData.match.matchDetails.competitionName]) return;
    if (!showResults) return;

    const matchInfos = getMatchInfosForNotification(notificationData);
    if (!matchInfos) return;

    const { title, body } = translate('notifications.matchScoreUpdated', language)[0](matchInfos);

    const notification = await getNotification({
      id: notificationData.match.id,
      title,
      body,
    });
    await notifee.displayNotification(notification);
  },
  matchFinished: async (notificationData) => {
    const { language, showResults, notifications: notificationsSettings } = await getSettings();
    if (!notificationsSettings[notificationData.match.matchDetails.competitionName]) return;

    const matchInfos = getMatchInfosForNotification(notificationData);
    if (!matchInfos) return;

    const { title, body } = translate('notifications.matchFinished', language)[0]({
      ...matchInfos,
      showResults,
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

function getMatchInfosForNotification({
  match,
  oldMatch,
}: {
  match: Extract<CoreData.Notifications.Notification, { match: any }>['match'];
  oldMatch?: typeof match;
}) {
  const karmineTeam = match.teams.find(
    (team) =>
      team?.name.toLowerCase().includes('karmine') || team?.name.toLowerCase().startsWith('kc')
  );

  if (!karmineTeam) {
    return null;
  }

  const oldKarmineTeam = oldMatch?.teams.find(
    (team) =>
      team?.name.toLowerCase().includes('karmine') || team?.name.toLowerCase().startsWith('kc')
  );
  const oldOpponentTeam = oldMatch?.teams.find((team) => team !== oldKarmineTeam);

  const opponentTeam = match.teams.find((team) => team !== karmineTeam);

  return {
    game: getGameAbbreviation(match.matchDetails.competitionName),
    karmineName: karmineTeam.name,
    karmineScore: karmineTeam.score?.score ?? 0,
    oldKarmineScore: oldKarmineTeam?.score?.score ?? 0,
    opponentName: opponentTeam?.name,
    opponentScore: opponentTeam?.score?.score ?? 0,
    oldOpponentScore: oldOpponentTeam?.score?.score ?? 0,
    scoreType: karmineTeam.score?.scoreType ?? 'gameWins',
  };
}

function getGameAbbreviation(game: CoreData.CompetitionName) {
  switch (game) {
    case CoreData.CompetitionName.LeagueOfLegendsLFL:
      return 'LFL';
    case CoreData.CompetitionName.LeagueOfLegendsLEC:
      return 'LEC';
    case CoreData.CompetitionName.RocketLeague:
      return 'RL';
    case CoreData.CompetitionName.SuperSmashBrosUltimate:
      return 'SSBU';
    case CoreData.CompetitionName.TFT:
      return 'TFT';
    case CoreData.CompetitionName.TeamfightTacticsGSC:
      return 'TFT';
    case CoreData.CompetitionName.TrackMania:
      return 'TM';
    case CoreData.CompetitionName.ValorantVCT:
      return 'VCT';
    case CoreData.CompetitionName.ValorantVCTGC:
      return 'VCTGC';
  }
}
