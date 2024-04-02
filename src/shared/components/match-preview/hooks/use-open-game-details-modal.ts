import { useCallback } from 'react';

import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';
import { useNavigation } from '~/shared/hooks/use-navigation';

export const useOpenGameDetailsModal = ({ match }: { match: CoreData.Match }) => {
  const navigation = useNavigation();

  return useCallback(() => navigation.navigate('gameDetailsModal', { match }), [navigation, match]);
};
