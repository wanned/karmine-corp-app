import { View } from 'react-native';

import { OnboardingNav } from './components/onboarding-nav';
import { ModalLayout } from '../modal-layout';

import { OnboardingContextProvider } from '~/shared/contexts/onboarding-context';
import { useStyles } from '~/shared/hooks/use-styles';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface OnboardingLayoutProps {
  children: React.ReactNode;
}

export const OnboardingLayout = ({ children }: OnboardingLayoutProps) => {
  const styles = useStyles(getStyles);

  return (
    <OnboardingContextProvider>
      <ModalLayout>
        <View style={styles.container}>{children}</View>
        <OnboardingNav />
      </ModalLayout>
    </OnboardingContextProvider>
  );
};

const getStyles = createStylesheet((theme) => ({
  container: {
    paddingHorizontal: theme.margins.screenHorizontal,
    flex: 1,
    backgroundColor: theme.colors.subtleBackground,
  },
}));
