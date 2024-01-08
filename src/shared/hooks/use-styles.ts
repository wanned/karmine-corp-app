import { useTheme } from './use-theme';
import { createStylesheet } from '../styles/create-stylesheet';

export const useStyles = <T extends ReturnType<typeof createStylesheet>>(
  getStyles: T
): ReturnType<T> => {
  const theme = useTheme();

  return getStyles(theme) as ReturnType<T>;
};
