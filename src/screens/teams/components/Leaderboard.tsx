import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';

import { Typographies } from '~/shared/components/typographies';
import { useStyles } from '~/shared/hooks/use-styles';
import { useTranslate } from '~/shared/hooks/use-translate';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface ContainerProps {
  title: string;
  children: React.ReactNode;
}

interface TeamsProps {
  children: React.ReactNode;
}

interface PlayersProps {
  children: React.ReactNode;
}

const Container = ({ children, title }: ContainerProps) => {
  const styles = useStyles(getStyles);

  return (
    <View>
      <Typographies.Title2>{title}</Typographies.Title2>
      <View style={styles.container}>{children}</View>
    </View>
  );
};

const Teams = ({ children }: TeamsProps) => {
  const translate = useTranslate();

  const styles = useStyles(getStyles);

  return (
    <View>
      <Typographies.Title3>{translate('teams.leaderboardTitle')}</Typographies.Title3>
      <View style={styles.teamsContainer}>{children}</View>
    </View>
  );
};

const Players = ({ children }: PlayersProps) => {
  const translate = useTranslate();

  const styles = useStyles(getStyles);

  const { width } = useWindowDimensions();

  return (
    <View style={StyleSheet.compose(styles.playersContainer, { width })}>
      <View style={styles.playersTitle}>
        <Typographies.Title3>{translate('teams.playersTitle')}</Typographies.Title3>
      </View>
      <ScrollView
        horizontal
        contentContainerStyle={StyleSheet.compose(styles.playersScrollContainer, { width })}
        showsHorizontalScrollIndicator={false}>
        {children}
      </ScrollView>
    </View>
  );
};

const getStyles = createStylesheet((theme) => ({
  container: {
    marginTop: 8,
    gap: 8,
  },
  teamsContainer: {
    marginTop: 4,
  },
  playersContainer: {
    marginLeft: -16,
  },
  playersTitle: {
    marginLeft: 16,
  },
  playersScrollContainer: {
    marginTop: 4,
    gap: 16,
    marginLeft: 16,
  },
}));

export const LeaderBoard = {
  Container,
  Teams,
  Players,
};
