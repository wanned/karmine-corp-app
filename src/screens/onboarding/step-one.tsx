import { View } from 'react-native';

import { Typographies } from '~/shared/components/typographies';
import { useStyles } from '~/shared/hooks/use-styles';
import { OnboardingLayout } from '~/shared/layouts/onboarding-layout';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

export const StepOne = () => {
  const styles = useStyles(getStyles);

  return (
    <OnboardingLayout>
      <View style={styles.container}>
        <Typographies.Body>Step One</Typographies.Body>
      </View>
    </OnboardingLayout>
  );
};

const getStyles = createStylesheet((theme) => ({
  container: {
    flex: 1,
  },
}));
