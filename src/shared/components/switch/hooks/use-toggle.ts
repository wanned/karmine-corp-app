import { useCallback } from 'react';
import Animated, { Easing, withTiming } from 'react-native-reanimated';

export const useToggle = ({
  onValueChange,
  thumbAnimatedValue,
  value,
}: {
  onValueChange: (value: boolean) => void;
  thumbAnimatedValue: Animated.SharedValue<number>;
  value: boolean;
}) => {
  return useCallback(() => {
    thumbAnimatedValue.value = withTiming(thumbAnimatedValue.value === 0 ? 1 : 0, {
      duration: 200,
      easing: Easing.linear,
    });

    onValueChange(!value);
  }, [onValueChange, thumbAnimatedValue, value]);
};
