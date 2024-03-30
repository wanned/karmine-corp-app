import { Image } from 'expo-image';
import { useAtom, useAtomValue } from 'jotai';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
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

    const [spoilerWidth, setSpoilerWidth] = useState(0);

    const showResultsAtom = useContext(SpoilerContext);
    const showResults = useAtomValue(showResultsAtom);

    return (
      <View
        style={StyleSheet.compose(
          styles.teamScore,
          showResults && isWinner === false && styles.teamScoreLoser
        )}>
        <View style={styles.teamScoreLeftContainer}>
          <Image
            source={{ uri: logo }}
            cachePolicy="memory-disk"
            style={{ width: 24, height: 24 }}
          />
          <Typographies.Body color={styles.teamScore.color}>{name}</Typographies.Body>
          {showResults && isWinner && (
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
          <ScoreText score={score} spoilerWidth={spoilerWidth} />
        </View>
      </View>
    );
  }
);

interface ScoreTextProps {
  score: string | number;
  spoilerWidth: number;
}

const ScoreText = ({ score, spoilerWidth }: ScoreTextProps) => {
  const styles = useStyles(getStyles);

  const showResultsAtom = useContext(SpoilerContext);
  const [showResults, setShowResults] = useAtom(showResultsAtom);

  const spoil = useCallback(() => {
    setShowResults((prev) => !prev);
  }, [setShowResults]);

  const textElement = useMemo(
    () => <Typographies.Body color={styles.teamScore.color}>{score.toString()}</Typographies.Body>,
    [score, styles.teamScore.color]
  );

  return (
    <>
      {textElement}
      {!showResults && score !== '-' && (
        <Pressable
          style={StyleSheet.compose(styles.spoilerRectangle, {
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
  spoilerRectangle: {
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
