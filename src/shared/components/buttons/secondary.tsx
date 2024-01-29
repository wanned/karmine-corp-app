import { StyleSheet, TouchableOpacity } from 'react-native';
import { Iconify } from 'react-native-iconify';

import { Typographies } from '../typographies';

import { useStyles } from '~/shared/hooks/use-styles';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface SecondaryProps {
  text: string;
  onPress: () => void;
  fillWidth?: boolean;
  withArrow?: boolean;
}

export const Secondary = ({
  text,
  onPress,
  fillWidth = false,
  withArrow = false,
}: SecondaryProps) => {
  const styles = useStyles(getStyles);

  return (
    <TouchableOpacity
      style={StyleSheet.compose(styles.button, fillWidth ? styles.fillWidth : undefined)}
      onPress={onPress}>
      <Typographies.Body color={styles.button.color} verticalTrim>
        {text}
      </Typographies.Body>
      {withArrow && (
        <Iconify icon="solar:arrow-right-linear" size={20} color={styles.iconColor.color} />
      )}
    </TouchableOpacity>
  );
};

const getStyles = createStylesheet((theme) => ({
  button: {
    color: theme.colors.foreground,
    backgroundColor: theme.colors.subtleBackground,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  fillWidth: {
    width: '100%',
  },
  iconColor: {
    color: theme.colors.foreground,
  },
}));
