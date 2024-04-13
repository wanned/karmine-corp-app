import { atom, useSetAtom, PrimitiveAtom } from 'jotai';
import { createContext, useContext, useEffect, useMemo } from 'react';

import { SettingsContext } from '../../../contexts/settings-context';

export const MatchSpoilerContext = createContext<PrimitiveAtom<boolean>>({} as any);

export const MatchSpoilerProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    settings: { showResults },
  } = useContext(SettingsContext);

  const showResultsAtom = useMemo(() => atom(false), []);
  const setShowResults = useSetAtom(showResultsAtom);

  useEffect(() => {
    setShowResults(showResults);
  }, [showResults, setShowResults]);

  return (
    <MatchSpoilerContext.Provider value={showResultsAtom}>{children}</MatchSpoilerContext.Provider>
  );
};
