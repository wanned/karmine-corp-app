import { View } from 'react-native';

import { Switch } from '~/shared/components/switch/switch';
import { Typographies } from '~/shared/components/typographies';
import { useStyles } from '~/shared/hooks/use-styles';
import { useTranslate } from '~/shared/hooks/use-translate';
import { createStylesheet } from '~/shared/styles/create-stylesheet';
import { Settings } from '~/shared/types/Settings';

export function SpoilerSettings({
  hideSpoilersSettings,
  setHideSpoilersSettings,
}: {
  hideSpoilersSettings: Settings['hideSpoilers'];
  setHideSpoilersSettings: (notificationSettings: Settings['hideSpoilers']) => void;
}) {
  const translate = useTranslate();

  const styles = useStyles(getStyles);

  return (
    <View style={styles.showResultsContainer}>
      <Typographies.Body>{translate('settings.spoiler.showResults')}</Typographies.Body>
      <Switch
        value={!hideSpoilersSettings}
        onValueChange={(value) => setHideSpoilersSettings(value)}
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
