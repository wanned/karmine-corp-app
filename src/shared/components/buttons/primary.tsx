import { StyleSheet, TouchableOpacity } from 'react-native';

import { Typographies } from '../typographies';

import { useStyles } from '~/shared/hooks/use-styles';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface PrimaryProps {
  text: string;
  onPress: () => void;
  fillWidth?: boolean;
}

export const Primary = ({ text, onPress, fillWidth = false }: PrimaryProps) => {
  const styles = useStyles(getStyles);

  return (
    <TouchableOpacity
      style={StyleSheet.compose(styles.button, fillWidth ? styles.fillWidth : undefined)}
      onPress={onPress}>
      <Typographies.Body color={styles.button.color}>{text}</Typographies.Body>
    </TouchableOpacity>
  );
};

const getStyles = createStylesheet((theme) => ({
  button: {
    color: theme.colors.background,
    backgroundColor: theme.colors.accent,
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
