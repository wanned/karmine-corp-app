import { createContext } from 'react';

import { StyleTokens } from '../styles/tokens';

interface ThemeContextValue {
  theme: StyleTokens;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: {} as StyleTokens,
});

export { ThemeContext };
