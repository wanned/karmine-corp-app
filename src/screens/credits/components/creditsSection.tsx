import { View } from 'react-native';

import { useApis } from '../hooks/use-apis';
import { useLibraries } from '../hooks/use-libraries';

import { Buttons } from '~/shared/components/buttons';
import { useStyles } from '~/shared/hooks/use-styles';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface CreditsSectionProps {
  sectionName: string;
}

export const CreditsSection = ({ sectionName }: CreditsSectionProps) => {
  const { data: apisData } = useApis();
  const { data: librariesData } = useLibraries();

  let data;
  if (sectionName === 'apis') {
    data = apisData;
  } else if (sectionName === 'libraries') {
    data = librariesData;
  }

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
