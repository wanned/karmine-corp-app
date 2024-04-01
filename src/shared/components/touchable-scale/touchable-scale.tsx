import * as Haptics from 'expo-haptics';
import React, { useCallback, useRef } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface TouchableScaleProps {
  onPress: () => void;
  onLongPress?: () => void;
  delayLongPress?: number;
  animationDuration?: number;
  hapticFeedback?: boolean;
  children: React.ReactNode;
}

export const TouchableScale = React.memo(
  ({
    onPress,
    onLongPress,
    delayLongPress = 500,
    animationDuration = 200,
    hapticFeedback = true,
    children,
  }: TouchableScaleProps) => {
    const scale = useSharedValue(0);
    const pressed = useRef(false);

    const inputRange = [0, 1];
    const outputRange = [1, 0.99];

    const style = useAnimatedStyle(() => {
      return {
        transform: [{ scale: interpolate(scale.value, inputRange, outputRange) }],
      };
    });

    const animate = useCallback(
      (toValue: number) => {
        scale.value = withTiming(toValue, {
          duration: animationDuration,
        });
      },
      [animationDuration]
    );

    const onPressIn = useCallback(() => {
      animate(1);
      pressed.current = true;

      setTimeout(() => {
        if (!pressed.current) return;

        animate(0);
        if (hapticFeedback) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        pressed.current = false;
      }, delayLongPress);
    }, [delayLongPress, animate, hapticFeedback]);

    const onPressOut = useCallback(() => {
      animate(0);
      pressed.current = false;
    }, [animate]);

    return (
      <Animated.View style={style}>
        <Pressable
          onPress={onPress}
          onLongPress={onLongPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}>
          {children}
        </Pressable>
      </Animated.View>
    );
  }
);
