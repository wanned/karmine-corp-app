import { createContext, useContext, useEffect } from 'react';
import { SettingsContext } from './settings-context';

interface MatchScoreContextValue {
  isSpoilerHidden: boolean;
  setIsSpoilerHidden: (isSpoilerHidden: boolean) => void;
}

export const MatchScoreContext = createContext<MatchScoreContextValue>({
  isSpoilerHidden: false,
  setIsSpoilerHidden: () => {},
});

export const MatchScoreContextProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: MatchScoreContextValue;
}) => {
  const {
    settings: { hideSpoilers },
  } = useContext(SettingsContext);

  useEffect(() => {
    value.setIsSpoilerHidden(hideSpoilers);
  }, [hideSpoilers]);

  return <MatchScoreContext.Provider value={value}>{children}</MatchScoreContext.Provider>;
};
