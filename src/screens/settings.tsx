import { StyleSheet, View } from 'react-native';

import { Typographies } from '~/shared/components/typographies';
import { DefaultLayout } from '~/shared/layouts/default-layout';

export default function SettingsScreen() {
  return (
    <DefaultLayout>
      <View style={styles.container}>
        <Typographies.Title1>Settings</Typographies.Title1>
      </View>
    </DefaultLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
