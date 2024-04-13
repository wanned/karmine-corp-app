import { useCallback } from 'react';

import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';
import { useNavigation } from '~/shared/hooks/use-navigation';

export const useOpenGameDetailsModal = ({
  match,
  shouldPreventOpenModal = false,
}: {
  match: CoreData.Match;
  shouldPreventOpenModal?: boolean;
}) => {
  const navigation = useNavigation();

  return useCallback(
    () => !shouldPreventOpenModal && navigation.navigate('gameDetailsModal', { match }),
    [navigation, match, shouldPreventOpenModal]
  );
};
