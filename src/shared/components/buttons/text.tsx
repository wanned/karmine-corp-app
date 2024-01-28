import { TouchableOpacity } from 'react-native';

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
    <TouchableOpacity onPress={onPress}>
      <Typographies.Body color={styles.button.color} verticalTrim>
        {text}
      </Typographies.Body>
    </TouchableOpacity>
  );
};

const getStyles = createStylesheet((theme) => ({
  button: {
    color: theme.colors.accent,
  },
}));
