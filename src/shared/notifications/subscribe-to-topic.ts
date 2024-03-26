import messaging from '@react-native-firebase/messaging';

const APP_TOPIC = '*';

export const subscribeToTopic = async () => {
  await messaging().subscribeToTopic(APP_TOPIC);
};
