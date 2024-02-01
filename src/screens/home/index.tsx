import { View } from 'react-native';

import { CardsSlot } from './components/cards-slot';
import { LastResults } from './components/last-results';
import { NextMatches } from './components/next-matches';

import { Buttons } from '~/shared/components/buttons';
import { useNavigation } from '~/shared/hooks/use-navigation';
import { useTranslate } from '~/shared/hooks/use-translate';
import { DefaultLayout } from '~/shared/layouts/default-layout';
import { createStylesheet } from '~/shared/styles/create-stylesheet';
import { styleTokens } from '~/shared/styles/tokens';

export default function HomeScreen() {
  const styles = getStyles(styleTokens);

  const navigation = useNavigation();

  const translate = useTranslate();

  return (
    <DefaultLayout>
      <CardsSlot style={styles.cardSlot} />
      <NextMatches
        max={3}
        viewMoreButton={
          <View style={styles.viewMoreButtonWrapper}>
            <Buttons.Text
              text={translate('home.nextMatchesViewMoreText')}
              onPress={() => navigation.navigate('nextMatchesModal')}
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
              onPress={() => navigation.navigate('lastResultsModal')}
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
  cardSlot: {
    marginTop: 8,
    marginBottom: 24,
  },
}));
