import { Image } from 'expo-image';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Typographies } from '~/shared/components/typographies';
import { useStyles } from '~/shared/hooks/use-styles';
import { useTranslate } from '~/shared/hooks/use-translate';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface TeamsProps {
  teams: TeamProps[];
}

export const Teams = ({ teams }: TeamsProps) => {
  const translate = useTranslate();

  const styles = useStyles(getStyles);

  const sortedTeams = useMemo(() => {
    const sortedTeams = [...teams].sort((a, b) => a.top - b.top);

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
  }, [teams]);

  return (
    <View>
      <Typographies.Title3>{translate('teams.leaderboardTitle')}</Typographies.Title3>
      <View style={styles.teamsContainer}>
        {sortedTeams.map((team, teamIndex) => (
          <Team key={teamIndex} {...team} />
        ))}
      </View>
    </View>
  );
};

interface TeamProps {
  logo: string;
  name: string;
  top: number;
  wins: number;
  looses: number;
  isKarmine?: boolean;
}

const Team = ({ logo, name, top, wins, looses, isKarmine = false }: TeamProps) => {
  const styles = useStyles(getStyles);

  return (
    <View style={StyleSheet.compose(styles.teamScore, isKarmine && styles.teamScoreKarmine)}>
      <View style={styles.teamScoreLeftContainer}>
        <Image source={{ uri: logo }} cachePolicy="memory-disk" style={{ width: 24, height: 24 }} />
        <Typographies.Body color={styles.teamScore.color} verticalTrim>
          {name}
        </Typographies.Body>
      </View>
      <View style={styles.teamScoreRightContainer}>
        <Typographies.Body color={styles.teamTop.color} verticalTrim>
          #{top.toString()}
        </Typographies.Body>
        <Typographies.Body color={styles.teamScore.color} verticalTrim>
          {wins.toString()}V · {looses.toString()}D
        </Typographies.Body>
      </View>
    </View>
  );
};

const getStyles = createStylesheet((theme) => ({
  teamsContainer: {
    marginTop: 4,
  },
  teamScore: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: theme.colors.foreground,
    paddingVertical: 2,
    opacity: theme.opacities.priority2,
  },
  teamScoreKarmine: {
    opacity: theme.opacities.priority1,
  },
  teamTop: {
    color: theme.colors.accent,
  },
  teamScoreLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  teamScoreRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
}));
