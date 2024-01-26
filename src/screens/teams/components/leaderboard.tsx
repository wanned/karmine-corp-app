import { Image } from 'expo-image';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Typographies } from '~/shared/components/typographies';
import { useStyles } from '~/shared/hooks/use-styles';
import { useTranslate } from '~/shared/hooks/use-translate';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface LeaderboardProps {
  leaderboard: LeaderboardTeamProps[];
}

export const Leaderboard = ({ leaderboard }: LeaderboardProps) => {
  const translate = useTranslate();

  const styles = useStyles(getStyles);

  const sortedTeams = useMemo(() => {
    const sortedTeams = [...leaderboard].sort((a, b) => a.top - b.top);

    const karmineIndex = sortedTeams.findIndex(({ isKarmine }) => isKarmine);
    let minIndex: number | undefined;
    let maxIndex: number | undefined;

    if (karmineIndex === -1 || karmineIndex === 0) {
      minIndex = 0;
      maxIndex = 2;
    } else if (karmineIndex === sortedTeams.length - 1) {
      minIndex = -3;
      maxIndex = undefined;
    } else {
      minIndex = karmineIndex - 1;
      maxIndex = karmineIndex + 1;
    }

    return sortedTeams.slice(minIndex, maxIndex !== undefined ? maxIndex + 1 : undefined);
  }, [leaderboard]);

  return (
    <View>
      <Typographies.Title3>{translate('teams.leaderboardTitle')}</Typographies.Title3>
      <View style={styles.leaderboardContainer}>
        {sortedTeams.map((team, teamIndex) => (
          <LeaderboardTeam key={teamIndex} {...team} />
        ))}
      </View>
    </View>
  );
};

interface LeaderboardTeamProps {
  logo: string;
  name: string;
  top: number;
  wins: number;
  looses: number;
  isKarmine?: boolean;
}

const LeaderboardTeam = ({
  logo,
  name,
  top,
  wins,
  looses,
  isKarmine = false,
}: LeaderboardTeamProps) => {
  const styles = useStyles(getStyles);

  return (
    <View
      style={StyleSheet.compose(
        styles.leaderboardTeamScore,
        isKarmine && styles.leaderboardTeamScoreKarmine
      )}>
      <View style={styles.leaderboardTeamScoreLeftContainer}>
        <Image source={{ uri: logo }} cachePolicy="memory-disk" style={{ width: 24, height: 24 }} />
        <Typographies.Body color={styles.leaderboardTeamScore.color} verticalTrim>
          {name}
        </Typographies.Body>
      </View>
      <View style={styles.leaderboardTeamScoreRightContainer}>
        <Typographies.Body color={styles.leaderboardTeamTop.color} verticalTrim>
          #{top.toString()}
        </Typographies.Body>
        <Typographies.Body color={styles.leaderboardTeamScore.color} verticalTrim>
          {wins.toString()}V · {looses.toString()}D
        </Typographies.Body>
      </View>
    </View>
  );
};

const getStyles = createStylesheet((theme) => ({
  leaderboardContainer: {
    marginTop: 4,
  },
  leaderboardTeamScore: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: theme.colors.foreground,
    paddingVertical: 2,
    opacity: theme.opacities.priority2,
  },
  leaderboardTeamScoreKarmine: {
    opacity: theme.opacities.priority1,
  },
  leaderboardTeamTop: {
    color: theme.colors.accent,
  },
  leaderboardTeamScoreLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  leaderboardTeamScoreRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
}));
