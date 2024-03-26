import notifee from '@notifee/react-native';

export const requestPermission = async () => {
  await notifee.requestPermission();
};
