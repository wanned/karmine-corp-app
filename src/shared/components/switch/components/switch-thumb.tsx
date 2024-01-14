import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { switchHeight } from '../constants';

import { useStyles } from '~/shared/hooks/use-styles';
import { useTheme } from '~/shared/hooks/use-theme';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

export const SwitchThumb = ({
  thumbAnimatedValue,
}: {
  thumbAnimatedValue: Animated.SharedValue<number>;
}) => {
  const styles = useStyles(getStyles);
  const theme = useTheme();

  const thumbAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: thumbAnimatedValue.value * 20,
      },
    ],
    backgroundColor:
      thumbAnimatedValue.value === 0 ? theme.colors.subtleForeground : theme.colors.accent,
  }));

  return <Animated.View style={[styles.thumb, thumbAnimatedStyle]} />;
};

const getStyles = createStylesheet((theme) => ({
  thumb: {
    width: switchHeight * 1.08,
    height: switchHeight * 1.08,
    borderRadius: (switchHeight * 1.08) / 2,
    position: 'absolute',
    top: -switchHeight * 0.04,
    left: -switchHeight * 0.04,
  },
}));
