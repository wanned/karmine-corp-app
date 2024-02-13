import '@total-typescript/ts-reset';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback } from 'react';

import { Notification } from './notification';

const NOTIFICATIONS_STORAGE_PREFIX = 'notifications';

const getNotification = async (id: string) => {
  const notification = await AsyncStorage.getItem(`${NOTIFICATIONS_STORAGE_PREFIX}:${id}`);
  return notification ? (JSON.parse(notification) as Notification) : null;
};

const getAllNotifications = async () => {
  const keys = await AsyncStorage.getAllKeys();
  const notificationKeys = keys.filter((key) => key.startsWith(NOTIFICATIONS_STORAGE_PREFIX));
  const notifications = await AsyncStorage.multiGet(notificationKeys);
  return notifications
    .map(([_, notification]) => (notification ? (JSON.parse(notification) as Notification) : null))
    .filter(Boolean);
};

const setNotification = async (id: string, notification: Notification) => {
  await AsyncStorage.setItem(`${NOTIFICATIONS_STORAGE_PREFIX}:${id}`, JSON.stringify(notification));
};

const removeNotification = async (id: string) => {
  await AsyncStorage.removeItem(`${NOTIFICATIONS_STORAGE_PREFIX}:${id}`);
};

export const useNotificationsStorage = () => {
  const _getNotification = useCallback(getNotification, []);
  const _getAllNotifications = useCallback(getAllNotifications, []);
  const _setNotification = useCallback(setNotification, []);
  const _removeNotification = useCallback(removeNotification, []);

  return {
    getNotification: _getNotification,
    getAllNotifications: _getAllNotifications,
    setNotification: _setNotification,
    removeNotification: _removeNotification,
  };
};

export const notificationsStorage = {
  getNotification,
  getAllNotifications,
  setNotification,
  removeNotification,
};
