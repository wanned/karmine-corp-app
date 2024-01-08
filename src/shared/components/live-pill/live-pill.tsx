import { View } from 'react-native';

import { Typographies } from '~/shared/components/typographies';
import { createStylesheet } from '~/shared/styles/create-stylesheet';
import { styleTokens } from '~/shared/styles/tokens';

export const LivePill = () => {
  const styles = getStyles(styleTokens);

  return (
    <View style={styles.livePill}>
      <Typographies.Label color={styles.livePill.color}>LIVE</Typographies.Label>
    </View>
  );
};

const getStyles = createStylesheet((theme) => ({
  livePill: {
    backgroundColor: theme.colors.streaming,
    paddingHorizontal: 10,
    borderRadius: 20,
    color: theme.colors.foreground,
  },
}));
