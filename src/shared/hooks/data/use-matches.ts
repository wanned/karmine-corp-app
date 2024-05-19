import { useStore } from '@nanostores/react';

import {
  useMatches as _useMatches,
  matchesAtom,
} from '~/lib/karmine-corp-api/adapters/react-native/use-matches';

export const useMatches = () => {
  const { matchesFetchingStatus } = _useMatches();
  const matches = useStore(matchesAtom);

  return {
    matchesFetchingStatus,
    matches,
  };
};
