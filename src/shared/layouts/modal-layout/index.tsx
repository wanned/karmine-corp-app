import { useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ModalHeaderBar } from './components/modal-header-bar';
import { useStyles } from '../../hooks/use-styles';
import { createStylesheet } from '../../styles/create-stylesheet';

interface ModalLayoutProps {
  children: React.ReactNode;
  scrollViewStyle?: ScrollView['props']['style'];
  opacifyOnScroll?: boolean;
  useScrollView?: boolean;
}

export const ModalLayout = ({
  children,
  scrollViewStyle,
  opacifyOnScroll,
  useScrollView = true,
}: ModalLayoutProps) => {
  const styles = useStyles(getStyles);
  const [handleScroll, setHandleScroll] =
    useState<(event: NativeSyntheticEvent<NativeScrollEvent>) => void>();

  StatusBar.setBarStyle('default');

  const ModalContentContainer = useScrollView ? ScrollView : View;

  return (
    <GestureHandlerRootView style={styles.container}>
      <ModalHeaderBar opacifyOnScroll={opacifyOnScroll} setHandleScroll={setHandleScroll} />
      <ModalContentContainer
        style={StyleSheet.compose(styles.modalContentContainer, scrollViewStyle)}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}>
        <View style={styles.childrenContainer}>{children}</View>
        <View style={styles.endSpacer} />
      </ModalContentContainer>
    </GestureHandlerRootView>
  );
};

const getStyles = createStylesheet((theme) => ({
  modalContentContainer: {
    flex: 1,
  },
  childrenContainer: {
    height: '100%',
  },
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  endSpacer: {
    height: 16,
  },
}));
