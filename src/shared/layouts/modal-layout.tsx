import { NavigationContainerRef, useNavigation } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import { Iconify } from 'react-native-iconify';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useStyles } from '../hooks/use-styles';
import { RootStackParamList } from '../navigation';
import { createStylesheet } from '../styles/create-stylesheet';

interface ModalLayoutProps {
  children: React.ReactNode;
}

export const ModalLayout = ({ children }: ModalLayoutProps) => {
  const styles = useStyles(getStyles);

  const safeAreaInsets = useSafeAreaInsets();

  const navigation = useNavigation<NavigationContainerRef<RootStackParamList>>();

  StatusBar.setBarStyle('default');

  return (
    <GestureHandlerRootView style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ ...styles.iconContainer, marginTop: safeAreaInsets.top }}>
        <Iconify icon="solar:arrow-left-linear" size={28} color={styles.icon.color} />
      </TouchableOpacity>
      {children}
    </GestureHandlerRootView>
  );
};

const getStyles = createStylesheet((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  iconContainer: {
    padding: 20,
  },
  icon: {
    color: theme.colors.foreground,
  },
}));
