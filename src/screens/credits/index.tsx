import { View } from 'react-native';

import { Contributors } from './components/contributors';
import { CreditsSection } from './components/creditsSection';

import { Typographies } from '~/shared/components/typographies';
import { useStyles } from '~/shared/hooks/use-styles';
import { useTranslate } from '~/shared/hooks/use-translate';
import { DefaultLayout } from '~/shared/layouts/default-layout';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

export default function CreditsScreen() {
  const styles = useStyles(getStyles);
  const translate = useTranslate();
  return (
    <DefaultLayout>
      <View style={styles.titleContainer}>
        <Typographies.Title1>{translate('credits.screenName')}</Typographies.Title1>
      </View>

      <View style={styles.creditsContainer}>
        <View>
          <Typographies.Title2>{translate('credits.contributors.title')}</Typographies.Title2>
          <View style={styles.sectionDescriptionContainer}>
            <Typographies.Body>{translate('credits.contributors.description')}</Typographies.Body>
          </View>
          <Contributors />
        </View>
        <View>
          <Typographies.Title2>{translate('credits.apis.title')}</Typographies.Title2>
          <View style={styles.sectionDescriptionContainer}>
            <Typographies.Body>{translate('credits.apis.description')}</Typographies.Body>
          </View>
          <CreditsSection sectionName="apis" />
        </View>
        <View>
          <Typographies.Title2>{translate('credits.libraries.title')}</Typographies.Title2>
          <View style={styles.sectionDescriptionContainer}>
            <Typographies.Body>{translate('credits.libraries.description')}</Typographies.Body>
          </View>
          <CreditsSection sectionName="libraries" />
        </View>
      </View>
    </DefaultLayout>
  );
}

const getStyles = createStylesheet((theme) => ({
  titleContainer: {
    marginBottom: 12,
  },
  sectionDescriptionContainer: {
    opacity: theme.opacities.priority2,
    marginBottom: 12,
  },
  creditsContainer: {
    flexDirection: 'column',
    gap: 24,
  },
  versionContainer: {
    marginTop: 48,
    marginBottom: 32,
    alignItems: 'center',
    color: theme.colors.subtleForeground,
  },
}));
