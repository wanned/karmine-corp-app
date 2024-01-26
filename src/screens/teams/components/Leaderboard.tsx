import { View } from 'react-native';

import { Players } from './Players';
import { Teams } from './Teams';

import { Typographies } from '~/shared/components/typographies';
import { useStyles } from '~/shared/hooks/use-styles';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface LeaderboardContainerProps {
  title: string;
  children: React.ReactNode;
}

const LeaderboardContainer = ({ children, title }: LeaderboardContainerProps) => {
  const styles = useStyles(getStyles);

  return (
    <View>
      <Typographies.Title2>{title}</Typographies.Title2>
      <View style={styles.container}>{children}</View>
    </View>
  );
};

const getStyles = createStylesheet((theme) => ({
  container: {
    marginTop: 12,
    gap: 8,
  },
}));

export const LeaderBoard = {
  Container: LeaderboardContainer,
  Teams,
  Players,
};
