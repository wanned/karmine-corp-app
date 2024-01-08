import { useContext, useMemo } from 'react';
import { Image, View } from 'react-native';

import { Typographies } from '~/shared/components/typographies';
import { ThemeContext } from '~/shared/contexts/theme-context';
import { useStyles } from '~/shared/hooks/use-styles';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface MatchTeamProps {
  logo: string;
  name: string;
  score: string | number;
  isWinner?: boolean;
}

export const MatchTeam = ({ logo, name, score, isWinner = false }: MatchTeamProps) => {
  const { theme } = useContext(ThemeContext);

  const styles = useStyles(getStyles);

  const textColor = useMemo(() => {
    return isWinner ? styles.teamScore.color : theme.colors.subtleForeground;
  }, [isWinner]);

  return (
    <View style={styles.teamScore}>
      <View style={styles.teamScoreLeftContainer}>
        <Image source={{ uri: logo }} style={{ width: 24, height: 24 }} />
        <Typographies.Body color={textColor}>{name}</Typographies.Body>
      </View>
      <Typographies.Body color={textColor}>{score.toString()}</Typographies.Body>
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
  teamScoreLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
}));
