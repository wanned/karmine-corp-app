import { Image } from 'expo-image';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Iconify } from 'react-native-iconify';

import { Typographies } from '~/shared/components/typographies';
import { CoreData } from '~/shared/data/core/types';
import { useStyles } from '~/shared/hooks/use-styles';
import { useTheme } from '~/shared/hooks/use-theme';
import { createStylesheet } from '~/shared/styles/create-stylesheet';
import { GetPixelColorAt } from '~/shared/utils/get-pixel-color-at';

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

interface PlayerProps {
  player: CoreData.Player;
  position: 'left' | 'right';
}

export const Player = ({ player, position }: PlayerProps) => {
  const theme = useTheme();
  const styles = useStyles(getStyles);

  const [format, setFormat] = useState<'closed' | 'far'>('closed');

  const onGetFormat = useCallback((format: 'closed' | 'far') => {
    setFormat(format);
  }, []);

  return (
    <>
      {player.imageUrl && <GetPixelColorAt imageUri={player.imageUrl} onGetFormat={onGetFormat} />}
      <View
        style={StyleSheet.compose(
          styles.container,
          position === 'right' ? styles.containerRightPosition : {}
        )}>
        <View style={styles.pictureContainer}>
          {player.imageUrl ?
            format === 'far' ?
              <Image
                source={{ uri: player.imageUrl }}
                cachePolicy="memory-disk"
                style={{ width: 70, height: 70 }}
              />
            : <Image
                source={{ uri: player.imageUrl }}
                cachePolicy="memory-disk"
                style={{ width: 45, height: 45 }}
              />

          : <View style={styles.noPictureContainer}>
              <Iconify icon="solar:user-bold" size={40} color={theme.colors.subtleForeground} />
            </View>
          }
        </View>
        <View
          style={StyleSheet.compose(
            styles.textsContainer,
            position === 'right' ? styles.textsContainerRightPosition : {}
          )}>
          <Typographies.Body>{player.name}</Typographies.Body>
          {player.role && (
            <Typographies.Body color={theme.colors.subtleForeground}>
              {capitalize(player.role)}
            </Typographies.Body>
          )}
        </View>
      </View>
    </>
  );
};

const getStyles = createStylesheet((theme) => ({
  container: {
    flexDirection: 'row',
    gap: 16,
  },
  containerRightPosition: {
    flexDirection: 'row-reverse',
  },
  pictureContainer: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.subtleBackground,
    borderRadius: 50,
    overflow: 'hidden',
    alignItems: 'center',
  },
  noPictureContainer: {
    marginTop: 4,
  },
  textsContainer: {
    gap: -4,
  },
  textsContainerRightPosition: {
    alignItems: 'flex-end',
  },
}));
