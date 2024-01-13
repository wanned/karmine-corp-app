import { StyleSheet, TouchableOpacity } from 'react-native';

import { Typographies } from '../typographies';

import { useStyles } from '~/shared/hooks/use-styles';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface TextProps extends React.ComponentProps<typeof TouchableOpacity> {
  text: string;
  onPress?: () => void;
  fillWidth: boolean;
}

export const Secondary = (props: TextProps) => {
  const styles = useStyles(getStyles);

  return (
    <TouchableOpacity
      style={StyleSheet.compose(styles.button, props.fillWidth ? styles.fillWidth : undefined)}
      {...props}>
      <Typographies.Body color={styles.button.color}>{props.text}</Typographies.Body>
    </TouchableOpacity>
  );
};

const getStyles = createStylesheet((theme) => ({
  button: {
    color: theme.colors.foreground,
    backgroundColor: theme.colors.subtleBackground,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },

  fillWidth: {
    width: '100%',
  },
}));
