import { useAtom } from 'jotai';
import { useContext, useCallback } from 'react';

import { MatchSpoilerContext } from '../contexts/match-spoiler-context';

export const useShowResults = () => {
  const showResultsAtom = useContext(MatchSpoilerContext);
  const [resultsShown, setResultsShown] = useAtom(showResultsAtom);

  const showResults = useCallback(() => setResultsShown(true), [setResultsShown]);

  return { showResults, resultsShown };
};
