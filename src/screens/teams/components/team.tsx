import { View } from 'react-native';

import { Leaderboard } from './leaderboard';
import { Players } from './players';

import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';
import { Typographies } from '~/shared/components/typographies';
import { useStyles } from '~/shared/hooks/use-styles';
import { useTranslate } from '~/shared/hooks/use-translate';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface TeamContainerProps {
  title: CoreData.CompetitionName;
  children: React.ReactNode;
}

const TeamContainer = ({ children, title }: TeamContainerProps) => {
  const styles = useStyles(getStyles);

  const translate = useTranslate();

  return (
    <View>
      <Typographies.Title2>{translate(`games.${title}`)}</Typographies.Title2>
      <View style={styles.container}>{children}</View>
    </View>
  );
};

const getStyles = createStylesheet((theme) => ({
  container: {
    gap: theme.spacing.large,
    marginBottom: theme.spacing.xlarge,
  },
}));

export const Team = {
  Container: TeamContainer,
  Leaderboard,
  Players,
};
