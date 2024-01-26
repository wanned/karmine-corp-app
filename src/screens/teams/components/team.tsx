import { View } from 'react-native';

import { Leaderboard } from './leaderboard';
import { Players } from './players';

import { Typographies } from '~/shared/components/typographies';
import { useStyles } from '~/shared/hooks/use-styles';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface TeamContainerProps {
  title: string;
  children: React.ReactNode;
}

const TeamContainer = ({ children, title }: TeamContainerProps) => {
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

export const Team = {
  Container: TeamContainer,
  Leaderboard,
  Players,
};
