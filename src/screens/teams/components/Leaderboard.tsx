import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';

import Player from './Player';

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
  players: Parameters<typeof Player>[0][];
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

const Players = ({ players }: PlayersProps) => {
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
        contentContainerStyle={styles.playersScrollContainer}
        showsHorizontalScrollIndicator={false}>
        {players
          .sort((a, b) => (a.isStreaming ? -1 : 1))
          .map((player) => (
            <Player {...player} key={player.name} />
          ))}
      </ScrollView>
    </View>
  );
};

const getStyles = createStylesheet((theme) => ({
  container: {
    marginTop: 12,
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
    marginBottom: 4,
  },
  playersScrollContainer: {
    marginTop: 4,
    gap: 16,
    paddingHorizontal: 16,
  },
}));

export const LeaderBoard = {
  Container,
  Teams,
  Players,
};
