import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { Player as PlayerProps } from './types/player';

import { Typographies } from '~/shared/components/typographies';
import { useStyles } from '~/shared/hooks/use-styles';
import { useTheme } from '~/shared/hooks/use-theme';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const Player = ({ picture, name, role, position }: PlayerProps) => {
  const theme = useTheme();

  const styles = useStyles(getStyles);

  return (
    <View
      style={StyleSheet.compose(
        styles.container,
        position === 'right' ? styles.containerRightPosition : {}
      )}>
      <View style={styles.pictureContainer}>
        <Image
          source={{ uri: picture }}
          cachePolicy="memory-disk"
          style={{ width: 70, height: 70 }}
        />
      </View>
      <View
        style={StyleSheet.compose(
          styles.textsContainer,
          position === 'right' ? styles.textsContainerRightPosition : {}
        )}>
        <Typographies.Body>{name}</Typographies.Body>
        <Typographies.Body color={theme.colors.subtleForeground}>
          {capitalize(role)}
        </Typographies.Body>
      </View>
    </View>
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
  textsContainer: {
    gap: -4,
  },
  textsContainerRightPosition: {
    alignItems: 'flex-end',
  },
}));
