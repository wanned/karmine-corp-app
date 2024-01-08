import { View, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { KarmineLogo } from '../components/logos/karmine-logo';
import { useStyles } from '../hooks/use-styles';
import { createStylesheet } from '../styles/create-stylesheet';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  const styles = useStyles(getStyles);
  const safeAreaInsets = useSafeAreaInsets();

  StatusBar.setBarStyle('default');

  return (
    <View
      style={StyleSheet.compose(styles.layout, {
        paddingTop: safeAreaInsets.top,
        paddingBottom: safeAreaInsets.bottom,
      })}>
      <View style={styles.header}>
        <KarmineLogo color={styles.headerLogo.color} width={38} height={36} />
      </View>
      {children}
    </View>
  );
};

const getStyles = createStylesheet((theme) => ({
  layout: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  header: {
    backgroundColor: theme.colors.background,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headerLogo: {
    color: theme.colors.foreground,
  },
}));
