import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

import { useStyles } from '~/shared/hooks/use-styles';
import { useTheme } from '~/shared/hooks/use-theme';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface CardProps {
  image: { uri: string };
  children: React.ReactNode;
}

export const Card = ({ image, children }: CardProps) => {
  const theme = useTheme();
  const gradientColor = theme.colors.subtleBackground;

  const styles = useStyles(getStyles);

  return (
    <View style={styles.card}>
      <Image style={styles.cardImage} source={image} cachePolicy="memory-disk" />
      <LinearGradient
        style={styles.cardGradient}
        colors={[`${gradientColor}00`, `${gradientColor}33`, `${gradientColor}FF`]}
        locations={[0, 0.83, 1]}
      />
      <LinearGradient
        style={styles.cardGradient}
        colors={[
          `${gradientColor}B5`,
          `${gradientColor}EA`,
          `${gradientColor}FA`,
          `${gradientColor}FF`,
        ]}
        locations={[0, 0.33, 0.48, 1]}
      />
      <View style={styles.childrenContainer}>{children}</View>
    </View>
  );
};

const getStyles = createStylesheet((theme) => ({
  card: {
    flex: 1,
    borderRadius: theme.roundness.xlarge,
    overflow: 'hidden',
    borderColor: theme.colors.subtleForeground2,
    borderWidth: 1,
  },
  cardImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  cardGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  childrenContainer: {
    padding: 16,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
}));
