import { StyleSheet, View } from 'react-native';

import { Typographies } from '~/shared/components/typographies';
import { useTranslate } from '~/shared/hooks/use-translate';
import { DefaultLayout } from '~/shared/layouts/default-layout';

export default function TeamsScreen() {
  const translate = useTranslate();

  return (
    <DefaultLayout>
      <View style={styles.container}>
        <Typographies.Title1>{translate('teams.screenName')}</Typographies.Title1>
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
