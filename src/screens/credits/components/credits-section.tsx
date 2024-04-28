import { View } from 'react-native';

import { Buttons } from '~/shared/components/buttons';
import { useStyles } from '~/shared/hooks/use-styles';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface CreditsSectionProps {
  sectionName: string;
  data:
    | {
        title: string;
      }[]
    | undefined;
}

export const CreditsSection = ({ sectionName, data }: CreditsSectionProps) => {
  const styles = useStyles(getStyles);

  return (
    <View style={styles.ButtonContainer}>
      {data?.map((button, index) => (
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
