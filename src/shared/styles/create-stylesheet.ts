import { StyleSheet } from 'react-native';

import { StyleTokens } from './tokens';

type Style = Parameters<typeof StyleSheet.create>[0];

export const createStylesheet = <T extends Style>(getStyles: (tokens: StyleTokens) => T) => {
  return StyleSheet.create(getStyles);
};
