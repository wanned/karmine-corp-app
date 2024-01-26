import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { Typographies } from '~/shared/components/typographies';
import { useStyles } from '~/shared/hooks/use-styles';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

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

export default Team;
