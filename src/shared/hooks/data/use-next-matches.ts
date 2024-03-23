import { atom, useAtomValue } from 'jotai';
import { selectAtom } from 'jotai/utils';
import { useCallback } from 'react';

import {
  matchesAtom,
  useMatches,
} from '~/lib/karmine-corp-api/adapters/react-native-hook/use-matches';
import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';

const nextMatchesAtom = atom((get) => {
  const matches = get(matchesAtom);

  const nextMatches = Object.values(matches)
    .flatMap((matches) => matches.filter((match) => match.status === 'upcoming'))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return nextMatches;
});

export const useNextMatches = (n?: number) => {
  useMatches(); // Ensure the matches are being fetched.

  return useAtomValue(
    selectAtom(
      nextMatchesAtom,
      useCallback((nextMatches) => (n === undefined ? nextMatches : nextMatches.slice(0, n)), [n]),
      useCallback(
        (a: CoreData.Match[], b: CoreData.Match[]) => {
          if (n === undefined) return Object.is(a, b);

          for (let i = 0; i < n; i++) {
            if (a[i] !== b[i]) return false;
          }
          return true;
        },
        [n]
      )
    )
  );
};
