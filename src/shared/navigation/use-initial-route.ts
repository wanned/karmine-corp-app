import notifee from '@notifee/react-native';
import { useEffect, useMemo, useState } from 'react';

import { ModalsParamList } from '.';
import { useSplashScreen } from '../hooks/use-splash-screen';
import { NotificationData } from '../types/NotificationData';

import { matchesAtom } from '~/lib/karmine-corp-api/adapters/react-native/use-matches';

export const useInitialModalRoute = () => {
  const [initialRouteName, setInitialRouteName] = useState<keyof ModalsParamList>('root');
  const [initialParams, setInitialParams] = useState<Partial<ModalsParamList> | undefined>(
    undefined
  );
  const [loaded, setLoaded] = useState(false);

  const { createHideSplashScreen } = useSplashScreen();
  const hideSplashScreen = useMemo(() => createHideSplashScreen(), []);

  useEffect(() => {
    (async () => {
      const initialNotification = await notifee.getInitialNotification();

      if (initialNotification !== null && initialNotification !== undefined) {
        const notificationData = initialNotification.notification.data as
          | NotificationData
          | undefined;

        if (notificationData?.type === 'match') {
          const searchingMatch = async (maxAttempts: number) => {
            const match = Object.values(matchesAtom.get())
              .flat()
              .find((m) => m.id === notificationData.matchId);

            if (match !== undefined) {
              return match;
            }

            if (maxAttempts === 0) {
              return undefined;
            }

            await new Promise((resolve) => setTimeout(resolve, 100));
          };

          const match = await searchingMatch(100); // Try to find the match 100 times means 10 seconds because each attempt is 100ms

          if (match !== undefined) {
            setInitialRouteName('gameDetailsModal');
            setInitialParams({
              gameDetailsModal: { match },
            });
          }
        }
      }

      setLoaded(true);
      hideSplashScreen();
    })();
  }, []);

  return {
    initialRouteName,
    initialParams,
    loaded,
  };
};
