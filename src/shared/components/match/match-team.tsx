import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { Typographies } from '~/shared/components/typographies';
import { useStyles } from '~/shared/hooks/use-styles';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface MatchTeamProps {
  logo: string;
  name: string;
  score: string | number;
  isWinner?: boolean;
}

export const MatchTeam = ({ logo, name, score, isWinner }: MatchTeamProps) => {
  const styles = useStyles(getStyles);

  return (
    <View style={StyleSheet.compose(styles.teamScore, isWinner === false && styles.teamScoreLoser)}>
      <View style={styles.teamScoreLeftContainer}>
        <Image source={{ uri: logo }} cachePolicy="memory-disk" style={{ width: 24, height: 24 }} />
        <Typographies.Body color={styles.teamScore.color}>{name}</Typographies.Body>
      </View>
      <Typographies.Body color={styles.teamScore.color}>{score.toString()}</Typographies.Body>
    </View>
  );
};

const getStyles = createStylesheet((theme) => ({
  teamScore: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: theme.colors.foreground,
    paddingVertical: 2,
  },
  teamScoreLoser: {
    opacity: theme.opacities.priority2,
  },
  teamScoreLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
}));
