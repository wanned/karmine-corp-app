import { Image } from 'expo-image';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';

import { useAnonymousKcPlayerImage } from '../hooks/use-anonymous-kc-player-image';

import { LivePill } from '~/shared/components/live-pill/live-pill';
import { Typographies } from '~/shared/components/typographies';
import { CoreData } from '~/shared/data/core/types';
import { useStyles } from '~/shared/hooks/use-styles';
import { useTranslate } from '~/shared/hooks/use-translate';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface PlayersProps {
  players: PlayerProps[];
}

export const Players = ({ players }: PlayersProps) => {
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
        {[...players]
          // Sort by streaming status, then by original order
          .sort((a, b) =>
            a.isStreaming === b.isStreaming ? players.indexOf(a) - players.indexOf(b)
            : a.isStreaming ? -1
            : 1
          )
          .map((player) => (
            <Player {...player} key={player.name} />
          ))}
      </ScrollView>
    </View>
  );
};

interface PlayerProps extends CoreData.KarminePlayer {}

const Player = ({ name, imageUrl, isStreaming = false }: PlayerProps) => {
  const styles = useStyles(getStyles);

  const anonymousKcPlayerImage = useAnonymousKcPlayerImage();

  return (
    <View style={styles.playerContainer}>
      <View style={styles.playerTopContainer}>
        {isStreaming && (
          <View style={styles.livePillContainer}>
            <LivePill />
          </View>
        )}
        <View style={styles.pictureContainer}>
          <Image
            source={{
              uri: imageUrl === '' || imageUrl === undefined ? anonymousKcPlayerImage : imageUrl,
            }}
            cachePolicy="memory-disk"
            style={{ width: 160, height: 160 }}
            contentFit="scale-down"
          />
        </View>
      </View>
      <Typographies.Body>{name}</Typographies.Body>
    </View>
  );
};

const getStyles = createStylesheet((theme) => ({
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
  playerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  playerTopContainer: {
    borderRadius: 40,
    backgroundColor: theme.colors.subtleBackground,
  },
  livePillContainer: {
    position: 'absolute',
    top: 0,
    right: -8,
  },
  pictureContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    alignItems: 'center',
  },
}));
