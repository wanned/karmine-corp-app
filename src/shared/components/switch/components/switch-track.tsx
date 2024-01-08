import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { switchHeight } from '../constants';

import { useStyles } from '~/shared/hooks/use-styles';
import { useTheme } from '~/shared/hooks/use-theme';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

export const SwitchTrack = ({
  thumbAnimatedValue,
}: {
  thumbAnimatedValue: Animated.SharedValue<number>;
}) => {
  const styles = useStyles(getStyles);
  const theme = useTheme();

  const trackAnimatedStyle = useAnimatedStyle(() => ({
    opacity: thumbAnimatedValue.value === 0 ? 0.5 : 1,
    backgroundColor:
      thumbAnimatedValue.value === 0
        ? theme.colors.subtleForeground
        : theme.colors.subtleBackground,
  }));

  return <Animated.View style={[styles.track, trackAnimatedStyle]} />;
};

const getStyles = createStylesheet((theme) => ({
  track: {
    width: switchHeight * 2,
    height: switchHeight,
    borderRadius: switchHeight / 2,
  },
}));
