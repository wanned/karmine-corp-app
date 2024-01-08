import { TouchableOpacity } from 'react-native';

import { Typographies } from '../typographies';

import { createStylesheet } from '~/shared/styles/create-stylesheet';
import { styleTokens } from '~/shared/styles/tokens';

interface TextButtonProps extends React.ComponentProps<typeof TouchableOpacity> {
  title: string;
}

export const TextButton = (props: TextButtonProps) => {
  const styles = getStyles(styleTokens);

  return (
    <TouchableOpacity {...props}>
      <Typographies.Body color={styles.button.color}>{props.title}</Typographies.Body>
    </TouchableOpacity>
  );
};

const getStyles = createStylesheet((theme) => ({
  button: {
    color: theme.colors.accent,
  },
}));
