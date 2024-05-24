import { useStore } from '@nanostores/react';
import { computed } from 'nanostores';

import { matchesAtom, useMatches } from '~/lib/karmine-corp-api/adapters/react-native/use-matches';

const liveMatchesAtom = computed(matchesAtom, (matches) => {
  const liveMatches = Object.values(matches)
    .flatMap((matches) => matches.filter((match) => match.status === 'live'))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return liveMatches;
});

export const useLiveMatches = () => {
  useMatches(); // Ensure the matches are being fetched.
  return useStore(liveMatchesAtom);
};
