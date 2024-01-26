import { TouchableOpacity, View } from 'react-native';

import { Typographies } from '../typographies';

import { useStyles } from '~/shared/hooks/use-styles';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface TextProps {
  text: string;
  onPress: () => void;
}

export const Text = ({ text, onPress }: TextProps) => {
  const styles = useStyles(getStyles);

  return (
    <View>
      <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
        <Typographies.Body color={styles.button.color}>{text}</Typographies.Body>
      </TouchableOpacity>
    </View>
  );
};

const getStyles = createStylesheet((theme) => ({
  buttonContainer: {
    alignSelf: 'flex-start',
  },
  button: {
    color: theme.colors.accent,
  },
}));
