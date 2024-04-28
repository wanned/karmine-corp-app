import { View } from 'react-native';

import { Contributors } from './components/contributors';
import { CreditsSection } from './components/credits-section';
import { useApis } from './hooks/use-apis';
import { useLibraries } from './hooks/use-libraries';

import { Spacer } from '~/shared/components/spacer/spacer';
import { Typographies } from '~/shared/components/typographies';
import { useStyles } from '~/shared/hooks/use-styles';
import { useTranslate } from '~/shared/hooks/use-translate';
import { ModalLayout } from '~/shared/layouts/modal-layout';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

export default function CreditsScreen() {
  const styles = useStyles(getStyles);

  const translate = useTranslate();

  const { data: apis } = useApis();
  const { data: libraries } = useLibraries();

  return (
    <ModalLayout>
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
          <CreditsSection sectionName="apis" data={apis} />
        </View>
        <View>
          <Typographies.Title2>{translate('credits.libraries.title')}</Typographies.Title2>
          <View style={styles.sectionDescriptionContainer}>
            <Typographies.Body>{translate('credits.libraries.description')}</Typographies.Body>
          </View>
          <CreditsSection sectionName="libraries" data={libraries} />
        </View>
      </View>

      <Spacer direction="vertical" size={32} />
    </ModalLayout>
  );
}

const getStyles = createStylesheet((theme) => ({
  titleContainer: {
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  sectionDescriptionContainer: {
    opacity: theme.opacities.priority2,
    marginBottom: 12,
  },
  creditsContainer: {
    flexDirection: 'column',
    gap: 24,
    paddingHorizontal: 16,
  },
}));
