import { TouchableOpacity, View } from 'react-native';
import { Iconify } from 'react-native-iconify';

import { Typographies } from '~/shared/components/typographies';
import { OnboardingContextValue } from '~/shared/contexts/onboarding-context';
import { useOnboarding } from '~/shared/hooks/use-onboarding';
import { useStyles } from '~/shared/hooks/use-styles';
import { useTheme } from '~/shared/hooks/use-theme';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

export const OnboardingNav = () => {
  const styles = useStyles(getStyles);

  const theme = useTheme();

  const { currentStep, setCurrentStep } = useOnboarding();

  return (
    <View style={styles.container}>
      <View style={styles.placer} />
      <Typographies.Label color={theme.colors.accent}>
        Étape {currentStep.toString()} sur 5
      </Typographies.Label>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          setCurrentStep(Math.min(5, currentStep + 1) as OnboardingContextValue['currentStep'])
        }>
        <Iconify icon="solar-arrow-right-linear" color={theme.colors.background} size={30} />
      </TouchableOpacity>
    </View>
  );
};

const getStyles = createStylesheet((theme) => ({
  container: {
    paddingHorizontal: theme.margins.screenHorizontal + 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  placer: {
    width: 48,
    height: 48,
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 25,
    backgroundColor: theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
