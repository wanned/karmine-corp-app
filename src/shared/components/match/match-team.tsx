import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Iconify } from 'react-native-iconify';

import { Typographies } from '~/shared/components/typographies';
import { useStyles } from '~/shared/hooks/use-styles';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface MatchTeamProps {
  logo: string;
  name: string;
  score: string | number;
  isWinner?: boolean;
}

export const MatchTeam = React.memo<MatchTeamProps>(
  ({ logo, name, score, isWinner }: MatchTeamProps) => {
    const styles = useStyles(getStyles);

    return (
      <View
        style={StyleSheet.compose(styles.teamScore, isWinner === false && styles.teamScoreLoser)}>
        <View style={styles.teamScoreLeftContainer}>
          <Image
            source={{ uri: logo }}
            cachePolicy="memory-disk"
            style={{ width: 24, height: 24 }}
          />
          <Typographies.Body color={styles.teamScore.color}>{name}</Typographies.Body>
          {isWinner && (
            <Iconify
              icon="solar:crown-bold"
              size={16}
              color={styles.crown.color}
              style={styles.crown}
            />
          )}
        </View>
        <Typographies.Body color={styles.teamScore.color}>{score.toString()}</Typographies.Body>
      </View>
    );
  }
);

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
  crown: {
    position: 'relative',
    color: '#F9D370',
    top: -1.5,
  },
}));
