import { useContext } from 'react';

import { ThemeContext } from '~/shared/contexts/theme-context';

export const useTheme = () => {
  return useContext(ThemeContext).theme;
};
