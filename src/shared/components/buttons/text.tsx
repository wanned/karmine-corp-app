import { TouchableOpacity } from 'react-native';

import { Typographies } from '../typographies';

import { useStyles } from '~/shared/hooks/use-styles';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface TextProps extends React.ComponentProps<typeof TouchableOpacity> {
  text: string;
  onPress?: () => void;
}

export const Text = (props: TextProps) => {
  const styles = useStyles(getStyles);

  return (
    <TouchableOpacity {...props}>
      <Typographies.Body color={styles.button.color}>{props.text}</Typographies.Body>
    </TouchableOpacity>
  );
};

const getStyles = createStylesheet((theme) => ({
  button: {
    color: theme.colors.accent,
  },
}));
