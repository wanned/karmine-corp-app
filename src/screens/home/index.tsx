import { CardsSlot } from './components/cards-slot';
import { LastResults } from './components/last-results';
import { NextMatches } from './components/next-matches';

import { Buttons } from '~/shared/components/buttons';
import { Spacer } from '~/shared/components/spacer/spacer';
import { useNavigation } from '~/shared/hooks/use-navigation';
import { useStyles } from '~/shared/hooks/use-styles';
import { useTheme } from '~/shared/hooks/use-theme';
import { useTranslate } from '~/shared/hooks/use-translate';
import { DefaultLayout } from '~/shared/layouts/default-layout';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

export default function HomeScreen() {
  const styles = useStyles(getStyles);
  const theme = useTheme();

  const navigation = useNavigation();

  const translate = useTranslate();

  return (
    <DefaultLayout>
      <CardsSlot style={styles.cardSlot} />
      <Spacer size={theme.spacing.xlarge * 2} direction="vertical" />
      <NextMatches
        max={3}
        viewMoreButton={
          <Buttons.Secondary
            text={translate('home.nextMatchesViewMoreText')}
            onPress={() => navigation.navigate('nextMatchesModal')}
          />
        }
      />
      <Spacer size={theme.spacing.xlarge * 2} direction="vertical" />
      <LastResults
        max={3}
        viewMoreButton={
          <Buttons.Secondary
            text={translate('home.lastResultsViewMoreText')}
            onPress={() => navigation.navigate('lastResultsModal')}
          />
        }
      />
      <Spacer size={theme.spacing.xlarge} direction="vertical" />
    </DefaultLayout>
  );
}

const getStyles = createStylesheet((theme) => ({
  cardSlot: {
    marginTop: theme.spacing.medium,
  },
}));
