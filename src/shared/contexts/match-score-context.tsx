import { atom, useSetAtom, PrimitiveAtom } from 'jotai';
import { createContext, useContext, useEffect, useMemo } from 'react';

import { SettingsContext } from './settings-context';

export const SpoilerContext = createContext<PrimitiveAtom<boolean>>({} as any);

export const MatchScoreContextProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    settings: { showResults },
  } = useContext(SettingsContext);

  const showResultsAtom = useMemo(() => atom(false), []);
  const setShowResults = useSetAtom(showResultsAtom);

  useEffect(() => {
    setShowResults(showResults);
  }, [showResults, setShowResults]);

  return <SpoilerContext.Provider value={showResultsAtom}>{children}</SpoilerContext.Provider>;
};
