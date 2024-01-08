import { createContext } from 'react';

import { StyleTokens } from '../styles/tokens';

interface ThemeContextValue {
  theme: StyleTokens;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: {} as StyleTokens,
});
