import { useCallback } from 'react';

import {
  cancelNotification,
  scheduleNotification,
  updateNotification,
} from '../utils/notifications/notifications';

export const useNotifications = () => {
  const _scheduleNotification = useCallback(scheduleNotification, []);
  const _updateNotification = useCallback(updateNotification, []);
  const _cancelNotification = useCallback(cancelNotification, []);

  return {
    scheduleNotification: _scheduleNotification,
    updateNotification: _updateNotification,
    cancelNotification: _cancelNotification,
  };
};
