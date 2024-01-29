import { useRef } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StatusBar, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ModalHeaderBar } from './components/modal-header-bar';
import { useStyles } from '../../hooks/use-styles';
import { createStylesheet } from '../../styles/create-stylesheet';

interface ModalLayoutProps {
  children: React.ReactNode;
  scrollViewStyle?: ScrollView['props']['style'];
  opacifyOnScroll?: boolean;
}

export const ModalLayout = ({ children, scrollViewStyle, opacifyOnScroll }: ModalLayoutProps) => {
  const styles = useStyles(getStyles);
  const handleScrollRef = useRef<(event: NativeSyntheticEvent<NativeScrollEvent>) => void>();

  StatusBar.setBarStyle('default');

  return (
    <GestureHandlerRootView style={styles.container}>
      <ModalHeaderBar opacifyOnScroll={opacifyOnScroll} handleScrollRef={handleScrollRef} />
      <ScrollView
        style={scrollViewStyle}
        showsVerticalScrollIndicator={false}
        onScroll={handleScrollRef.current}>
        <View style={styles.childrenContainer}>{children}</View>
        <View style={styles.endSpacer} />
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const getStyles = createStylesheet((theme) => ({
  childrenContainer: {
    flex: 1,
  },
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  endSpacer: {
    height: 16,
  },
}));
