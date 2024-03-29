import { View } from 'react-native';

import { Switch } from '~/shared/components/switch/switch';
import { Typographies } from '~/shared/components/typographies';
import { useStyles } from '~/shared/hooks/use-styles';
import { useTranslate } from '~/shared/hooks/use-translate';
import { createStylesheet } from '~/shared/styles/create-stylesheet';
import { Settings } from '~/shared/types/Settings';

export function SpoilerSettings({
  showResultsSettings,
  setShowResultsSettings,
}: {
  showResultsSettings: Settings['showResults'];
  setShowResultsSettings: (notificationSettings: Settings['showResults']) => void;
}) {
  const translate = useTranslate();

  const styles = useStyles(getStyles);

  return (
    <View style={styles.showResultsContainer}>
      <Typographies.Body>{translate('settings.spoiler.showResults')}</Typographies.Body>
      <Switch
        value={showResultsSettings}
        onValueChange={(value) => setShowResultsSettings(value)}
      />
    </View>
  );
}

const getStyles = createStylesheet((theme) => ({
  showResultsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
}));
