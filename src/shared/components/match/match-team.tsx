import { Image } from 'expo-image';
import { useAtom } from 'jotai';
import React, { useCallback, useContext, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Iconify } from 'react-native-iconify';

import { Typographies } from '~/shared/components/typographies';
import { SpoilerContext } from '~/shared/contexts/match-score-context';
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

    const [spoilerWidth, setSpoilerWidth] = React.useState(0);

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
        <View
          onLayout={(e) => {
            const { width } = e.nativeEvent.layout;

            setSpoilerWidth(width);
          }}>
          <ScoreText score={score} styles={styles} spoilerWidth={spoilerWidth} />
        </View>
      </View>
    );
  }
);

interface ScoreTextProps {
  score: string | number;
  styles: any;
  spoilerWidth: number;
}

const ScoreText = ({ score, styles, spoilerWidth }: ScoreTextProps) => {
  const hideSpoilersAtom = useContext(SpoilerContext);
  const [hideSpoilers, setHideSpoilers] = useAtom(hideSpoilersAtom);

  const spoil = useCallback(() => {
    setHideSpoilers(!hideSpoilers);
  }, []);

  const textElement = useMemo(
    () => <Typographies.Body color={styles.teamScore.color}>{score.toString()}</Typographies.Body>,
    [score]
  );

  return (
    <>
      {textElement}
      {!hideSpoilers && score !== '-' && (
        <TouchableOpacity
          style={StyleSheet.compose(styles.hideSpoiler, {
            width: Math.max(20, spoilerWidth),
          })}
          onPress={spoil}
        />
      )}
    </>
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
  hideSpoiler: {
    height: 20,
    borderRadius: 4,
    backgroundColor: theme.colors.subtleBackground,
    position: 'absolute',
    top: '50%',
    right: 0,
    transform: [{ translateY: -10 }],
  },
  crown: {
    position: 'relative',
    color: '#F9D370',
    top: -1.5,
  },
}));
