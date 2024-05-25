import { useStore } from '@nanostores/react';
import { subHours } from 'date-fns';
import { computed } from 'nanostores';
import { useMemo } from 'react';

import { matchesAtom, useMatches } from '~/lib/karmine-corp-api/adapters/react-native/use-matches';
import { selectAtom } from '~/shared/utils/select-atom';

const nextMatchesAtom = computed(matchesAtom, (matches) => {
  const nextMatches = Object.values(matches)
    .flatMap((matches) =>
      matches.filter(
        (match) => match.status === 'upcoming' && new Date(match.date) >= subHours(new Date(), 12)
      )
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return nextMatches;
});

export const useNextMatches = (n?: number) => {
  useMatches(); // Ensure the matches are being fetched.

  return useStore(
    useMemo(
      () =>
        selectAtom(
          computed(nextMatchesAtom, (nextMatches) => {
            return n === undefined ? nextMatches : nextMatches.slice(0, n);
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
