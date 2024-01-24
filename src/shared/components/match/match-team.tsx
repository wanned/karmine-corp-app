import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Iconify } from 'react-native-iconify';

import { Typographies } from '~/shared/components/typographies';
import { useSettings } from '~/shared/hooks/use-settings';
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

    const { hideSpoilers } = useSettings();

    const [isSpoilerHidden, setIsSpoilerHidden] = React.useState(hideSpoilers);

    React.useEffect(() => {
      setIsSpoilerHidden(hideSpoilers);
    }, [hideSpoilers]);

    const spoil = () => setIsSpoilerHidden(!isSpoilerHidden);

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
        <View>
          <Typographies.Body color={styles.teamScore.color}>{score.toString()}</Typographies.Body>
          {!isSpoilerHidden && <TouchableOpacity style={styles.hideSpoiler} onPress={spoil} />}
        </View>
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
  hideSpoiler: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: 'black',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
  },
  crown: {
    position: 'relative',
    color: '#F9D370',
    top: -1.5,
  },
}));
