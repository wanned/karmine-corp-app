import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MutableRefObject, useCallback, useEffect, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { Iconify } from 'react-native-iconify';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useStyles } from '~/shared/hooks/use-styles';
import { useTheme } from '~/shared/hooks/use-theme';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface ModalHeaderBarProps {
  opacifyOnScroll?: boolean;
  handleScrollRef?: MutableRefObject<NonNullable<ScrollView['props']['onScroll']> | undefined>;
}

export const ModalHeaderBar = ({ opacifyOnScroll, handleScrollRef }: ModalHeaderBarProps) => {
  const navigation = useNavigation();
  const safeAreaInsets = useSafeAreaInsets();
  const styles = useStyles(getStyles);

  const { backgroundContainerStyle, handleModalScroll, handleHeaderLayout, headerHeight } =
    useHeaderBarFadingBackground({
      opacifyOnScroll,
    });

  useEffect(() => {
    if (handleScrollRef) {
      handleScrollRef.current = handleModalScroll;
    }
  }, [handleModalScroll]);

  return (
    <View style={{ overflow: 'hidden' }} onLayout={handleHeaderLayout}>
      <Animated.View style={backgroundContainerStyle}>
        <HeaderBackground headerHeight={headerHeight} />
      </Animated.View>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginTop: safeAreaInsets.top }}>
          <Iconify icon="solar:arrow-left-linear" size={28} color={styles.icon.color} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const useHeaderBarFadingBackground = ({ opacifyOnScroll }: ModalHeaderBarProps) => {
  const scrollY = useSharedValue(opacifyOnScroll ? 0 : Infinity);
  const [headerHeight, setHeaderHeight] = useState(0);

  const backgroundContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -headerHeight + Math.min(scrollY.value, headerHeight * 2) }],
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  }));

  const handleModalScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!opacifyOnScroll) {
        scrollY.value = Infinity;
        return;
      }
      scrollY.value = event.nativeEvent.contentOffset.y * 2; // The background should be fully opaque when we scroll over 50 from the top
    },
    [scrollY, opacifyOnScroll]
  );

  const handleHeaderLayout = useCallback(
    (event: Parameters<NonNullable<View['props']['onLayout']>>[0]) => {
      setHeaderHeight(event.nativeEvent.layout.height);
    },
    [setHeaderHeight]
  );

  return {
    backgroundContainerStyle,
    handleModalScroll,
    handleHeaderLayout,
    headerHeight,
  };
};

const HeaderBackground = ({ headerHeight }: { headerHeight: number }) => {
  const theme = useTheme();
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <>
      <View
        // This view is entirely filled with the background color and is positioned
        // on top of the linear gradient
        style={{
          backgroundColor: theme.colors.background,
          height: headerHeight + safeAreaInsets.top,
          width: '100%',
          position: 'absolute',
          top: -(headerHeight + safeAreaInsets.top - 1),
        }}
      />
      <LinearGradient
        colors={[`${theme.colors.background}FF`, `${theme.colors.background}00`]}
        locations={[0, 1]}
        style={{
          height: '100%',
        }}
      />
    </>
  );
};

const getStyles = createStylesheet((theme) => ({
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  headerBackground: {
    height: '100%',
  },
  icon: {
    color: theme.colors.foreground,
  },
}));
