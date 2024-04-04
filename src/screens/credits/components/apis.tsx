import { View } from 'react-native';

import { useApis } from '../hooks/use-apis';

import { Buttons } from '~/shared/components/buttons';
import { useStyles } from '~/shared/hooks/use-styles';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

export const Apis = () => {
  const { data: apis } = useApis();

  const styles = useStyles(getStyles);

  return (
    <View style={styles.ButtonContainer}>
      {apis?.map((button, index) => (
        <Buttons.Secondary
          key={index}
          text={button.title}
          onPress={() => {}}
          fillWidth
          forceAlignLeft
        />
      ))}
    </View>
  );
};

const getStyles = createStylesheet((theme) => ({
  ButtonContainer: {
    marginTop: 12,
    gap: 8,
  },
}));
