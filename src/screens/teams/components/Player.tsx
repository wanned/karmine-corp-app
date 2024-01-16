import { Image } from 'expo-image';
import { View } from 'react-native';

import { LivePill } from '~/shared/components/live-pill/live-pill';
import { Typographies } from '~/shared/components/typographies';
import { useStyles } from '~/shared/hooks/use-styles';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface PlayerProps {
  picture: string;
  name: string;
  isStreaming?: boolean;
}

const Player = ({ name, picture, isStreaming = false }: PlayerProps) => {
  const styles = useStyles(getStyles);

  return (
    <View style={styles.container}>
      <View style={styles.playerTopContainer}>
        {isStreaming && (
          <View style={styles.livePillContainer}>
            <LivePill />
          </View>
        )}
        <View style={styles.pictureContainer}>
          <Image
            source={{ uri: picture }}
            cachePolicy="memory-disk"
            style={{ width: 160, height: 160 }}
          />
        </View>
      </View>
      <Typographies.Body>{name}</Typographies.Body>
    </View>
  );
};
export default Player;

const getStyles = createStylesheet((theme) => ({
  container: {
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
