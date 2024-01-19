import { View, StyleSheet, StatusBar, ScrollView } from 'react-native';
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
      style={StyleSheet.compose(styles.appContainer, {
        paddingTop: safeAreaInsets.top,
        paddingBottom: safeAreaInsets.bottom,
      })}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: '100%' }}>
        <View style={styles.layout}>
          <View style={styles.header}>
            <KarmineLogo color={styles.headerLogo.color} width={38} height={36} />
          </View>
          {children}
          <View style={styles.endSpacer} />
        </View>
      </ScrollView>
    </View>
  );
};

const getStyles = createStylesheet((theme) => ({
  appContainer: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  layout: {
    flex: 1,
    paddingHorizontal: 16,
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
  endSpacer: {
    height: 16,
  },
}));
