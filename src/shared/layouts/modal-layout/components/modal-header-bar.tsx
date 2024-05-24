import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, TouchableOpacity, View } from 'react-native';
import { Iconify } from 'react-native-iconify';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useNavigation } from '~/shared/hooks/use-navigation';
import { useStyles } from '~/shared/hooks/use-styles';
import { useTheme } from '~/shared/hooks/use-theme';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface ModalHeaderBarProps {
  opacifyOnScroll?: boolean;
  setHandleScroll?: (
    handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  ) => void;
}

export const ModalHeaderBar = ({ opacifyOnScroll, setHandleScroll }: ModalHeaderBarProps) => {
  const navigation = useNavigation();
  const safeAreaInsets = useSafeAreaInsets();
  const styles = useStyles(getStyles);

  const { backgroundContainerStyle, handleModalScroll, headerHeight, setHeaderHeight } =
    useHeaderBarFadingBackground({
      opacifyOnScroll,
    });

  useEffect(() => {
    if (setHandleScroll) {
      setHandleScroll(() => handleModalScroll);
    }
  }, [handleModalScroll]);

  return (
    <View
      style={{ overflow: 'hidden' }}
      onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}>
      <Animated.View style={backgroundContainerStyle}>
        <HeaderBackground headerHeight={headerHeight} />
      </Animated.View>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            navigation.canGoBack() ? navigation.goBack() : navigation.replace('root')
          }
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

  return {
    backgroundContainerStyle,
    handleModalScroll,
    setHeaderHeight,
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
