import { atom, useAtomValue } from 'jotai';
import { selectAtom } from 'jotai/utils';
import { useCallback } from 'react';

import {
  matchesAtom,
  useMatches,
} from '~/lib/karmine-corp-api/adapters/react-native/use-matches';
import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';

const liveMatchesAtom = atom((get) => {
  const matches = get(matchesAtom);

  const liveMatches = Object.values(matches)
    .flatMap((matches) => matches.filter((match) => match.status === 'live'))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return liveMatches;
});

export const useLiveMatches = () => {
  useMatches(); // Ensure the matches are being fetched.

  return useAtomValue(
    selectAtom(
      liveMatchesAtom,
      useCallback((liveMatches) => liveMatches, []),
      useCallback((a: CoreData.Match[], b: CoreData.Match[]) => {
        for (let i = 0; i < Math.max(a.length, b.length); i++) {
          if (a[i] !== b[i]) return false;
        }
        return true;
      }, [])
    )
  );
};
