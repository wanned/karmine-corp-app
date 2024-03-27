import notifee from '@notifee/react-native';

export const requestNotificationPermission = async () => {
  await notifee.requestPermission();
};
