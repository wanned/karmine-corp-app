import { useContext, useMemo } from 'react';
import { View } from 'react-native';
import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';

import { SpoilerSettings } from '~/screens/settings/components/spoiler-settings';
import { MatchPreview } from '~/shared/components/match-preview/match-preview';
import { Title2 } from '~/shared/components/typographies/title2';
import { SettingsContext } from '~/shared/contexts/settings-context';
import { useStyles } from '~/shared/hooks/use-styles';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

export const Step2 = () => {
  const { settings, setSettings } = useContext(SettingsContext);

  const styles = useStyles(getStyles);

  const match = useMemo<CoreData.Match>(
    () => ({
      date: new Date(),
      id: '1',
      matchDetails: { competitionName: CoreData.CompetitionName.ValorantVCTGC },
      status: 'upcoming',
      streamLink: 'kamet0',
      teams: [
        {
          logoUrl: 'https://medias.kametotv.fr/karmine/teams_logo/KC.png',
          name: 'Karmine Corp',
          score: {
            score: 1,
          },
        },
        {
          logoUrl: 'https://medias.kametotv.fr/karmine/teams_logo/FUT Esports.png',
          name: 'FUT Esports',
          score: {
            score: 0,
          },
        },
      ],
    }),
    []
  );

  return (
    <View style={styles.container}>
      <MatchPreview match={match} variant="normal" shouldPreventOpenModal />
      <View style={styles.spoilerSettingsContainer}>
        <SpoilerSettings
          showResultsSettings={settings.showResults}
          setShowResultsSettings={(showResults) => setSettings({ ...settings, showResults })}
        />
      </View>
    </View>
  );
};

const getStyles = createStylesheet((theme) => ({
  container: {
    flexDirection: 'column',
    gap: theme.spacing.xlarge,
  },
  spoilerSettingsContainer: {
    paddingHorizontal: theme.spacing.xlarge,
  },
}));
