import { useContext } from 'react';

import { ThemeContext } from '../contexts/theme-context';
import { createStylesheet } from '../styles/create-stylesheet';

export const useStyles = <T extends ReturnType<typeof createStylesheet>>(
  getStyles: T
): ReturnType<T> => {
  const { theme } = useContext(ThemeContext);

  return getStyles(theme) as ReturnType<T>;
};
