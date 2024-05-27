import * as Haptics from 'expo-haptics';
import React, { useCallback, useRef } from 'react';
import { GestureResponderEvent, Pressable, View } from 'react-native';
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
  style?: View['props']['style'];
}

export const TouchableScale = React.memo(
  ({
    onPress,
    onLongPress,
    delayLongPress = 500,
    animationDuration = 200,
    hapticFeedback = true,
    children,
    style: _style,
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

    const startX = useRef<number | null>(null);
    const endX = useRef<number | null>(null);
    const startY = useRef<number | null>(null);
    const endY = useRef<number | null>(null);
    const startTimestamp = useRef<number | null>(null);

    const onPressIn = useCallback(
      (event: GestureResponderEvent) => {
        animate(1);
        pressed.current = true;
        startX.current = event.nativeEvent.pageX;
        startY.current = event.nativeEvent.pageY;
        startTimestamp.current = Date.now();

        setTimeout(() => {
          if (!pressed.current) return;

          animate(0);
          if (hapticFeedback) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          pressed.current = false;
        }, delayLongPress);
      },
      [delayLongPress, animate, hapticFeedback]
    );

    const onPressOut = useCallback(
      (event: GestureResponderEvent) => {
        endX.current = event.nativeEvent.pageX;
        endY.current = event.nativeEvent.pageY;

        if (
          // Check if it's a press and not a swipe X
          startX.current &&
          endX.current &&
          Math.abs(startX.current - endX.current) < 0.5 &&
          // Check if it's a press and not a swipe Y
          startY.current &&
          endY.current &&
          Math.abs(startY.current - endY.current) < 0.5 &&
          // Check if the press is not too long
          startTimestamp.current &&
          Date.now() - startTimestamp.current < delayLongPress
        ) {
          onPress();
        }

        animate(0);
        pressed.current = false;
        startX.current = null;
        endX.current = null;
        startY.current = null;
        endY.current = null;
        startTimestamp.current = null;
      },
      [animate]
    );

    const onMove = useCallback((event: GestureResponderEvent) => {
      endX.current = event.nativeEvent.pageX;
    }, []);

    return (
      <Animated.View style={[_style, style]}>
        <Pressable
          onTouchStart={onLongPress}
          onPressIn={onPressIn}
          onTouchEnd={onPressOut}
          onTouchMove={onMove}>
          {children}
        </Pressable>
      </Animated.View>
    );
  }
);
