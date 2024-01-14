import { NavigationContainerRef, useNavigation } from '@react-navigation/native';
import { View } from 'react-native';

import { LastResults } from './components/last-results';
import { NextMatches } from './components/next-matches';

import { Buttons } from '~/shared/components/buttons';
import { useTranslate } from '~/shared/hooks/use-translate';
import { DefaultLayout } from '~/shared/layouts/default-layout';
import { RootStackParamList } from '~/shared/navigation';
import { createStylesheet } from '~/shared/styles/create-stylesheet';
import { styleTokens } from '~/shared/styles/tokens';

export default function HomeScreen() {
  const styles = getStyles(styleTokens);

  const navigation = useNavigation<NavigationContainerRef<RootStackParamList>>();

  const translate = useTranslate();

  return (
    <DefaultLayout>
      <NextMatches
        max={3}
        viewMoreButton={
          <View style={styles.viewMoreButtonWrapper}>
            <Buttons.Text
              text={translate('home.nextMatchesViewMoreText')}
              onPress={() => navigation.navigate('calendar')}
            />
          </View>
        }
      />
      <LastResults
        max={3}
        viewMoreButton={
          <View style={styles.viewMoreButtonWrapper}>
            <Buttons.Text
              text={translate('home.lastResultsViewMoreText')}
              onPress={() => navigation.navigate('calendar')}
            />
          </View>
        }
      />
    </DefaultLayout>
  );
}

const getStyles = createStylesheet((theme) => ({
  viewMoreButtonWrapper: {
    marginVertical: 16,
    textAlign: 'center',
    alignItems: 'center',
  },
}));
