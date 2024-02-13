import { getSavedSettings } from '../settings';
import { translate } from '../translate';

import { CoreData } from '~/shared/data/core/types';

export type Notification = {
  type: 'match';
  id: string;
  at: Date;
  teamName: CoreData.CompetitionName;
  opponentName?: string;
};

export const formatNotification = async (
  notification: Notification
): Promise<{ title: string; body: string }> => {
  const language = (await getSavedSettings()).language;

  switch (notification.type) {
    case 'match': {
      return {
        title: translate('notifications.matchReminder.title', language),
        body:
          notification.opponentName ?
            translate('notifications.matchReminder.bodyWithOpponent', language)
              .replace('{teamName}', translate(`games.${notification.teamName}`, language))
              .replace('{opponentName}', notification.opponentName)
          : translate('notifications.matchReminder.bodyWithoutOpponent', language).replace(
              '{teamName}',
              translate(`games.${notification.teamName}`, language)
            ),
      };
    }
  }
};
