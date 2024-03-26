import { atom, useSetAtom, PrimitiveAtom } from 'jotai';
import { createContext, useContext, useEffect, useMemo } from 'react';

import { SettingsContext } from './settings-context';

export const SpoilerContext = createContext<PrimitiveAtom<boolean>>({} as any);

export const MatchScoreContextProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    settings: { hideSpoilers },
  } = useContext(SettingsContext);

  const hideSpoilersAtom = useMemo(() => atom(false), []);
  const setHideSpoilers = useSetAtom(hideSpoilersAtom);

  useEffect(() => {
    setHideSpoilers(hideSpoilers);
  }, [hideSpoilers, setHideSpoilers]);

  return <SpoilerContext.Provider value={hideSpoilersAtom}>{children}</SpoilerContext.Provider>;
};
