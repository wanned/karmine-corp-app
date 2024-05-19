import { useStore } from '@nanostores/react';
import { computed } from 'nanostores';
import { useMemo } from 'react';

import { matchesAtom, useMatches } from '~/lib/karmine-corp-api/adapters/react-native/use-matches';
import { selectAtom } from '~/shared/utils/select-atom';

const matchesResultsAtom = computed(matchesAtom, (matches) => {
  const matchesResults = Object.values(matches)
    .flatMap((matches) => matches.filter((match) => match.status === 'finished'))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return matchesResults;
});

export const useMatchesResults = (n?: number) => {
  useMatches(); // Ensure the matches are being fetched.

  return useStore(
    useMemo(
      () =>
        selectAtom(
          computed(matchesResultsAtom, (matchesResults) => {
            return n === undefined ? matchesResults : matchesResults.slice(0, n);
          }),
          (a, b) => {
            if (n === undefined) return Object.is(a, b);

            for (let i = 0; i < n; i++) {
              if (a[i] !== b[i]) return false;
            }
            return true;
          }
        ),
      [n]
    )
  );
};
