import * as Notifications from 'expo-notifications';

export const requestNotificationPermissions = async () => {
  await Notifications.setNotificationChannelAsync('default', {
    name: 'default',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#00CCFF7C',
  });

  const settings = await Notifications.getPermissionsAsync();

  const notificationPermission =
    settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;

  if (notificationPermission) {
    return true;
  }

  const { granted } = await Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowBadge: true, allowSound: true },
  });

  return granted;
};
