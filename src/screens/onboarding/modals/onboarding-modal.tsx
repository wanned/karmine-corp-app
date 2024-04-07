import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';

import { Buttons } from '~/shared/components/buttons';
import { Body } from '~/shared/components/typographies/body';
import { Title1 } from '~/shared/components/typographies/title1';
import { useNavigation } from '~/shared/hooks/use-navigation';
import { useStyles } from '~/shared/hooks/use-styles';
import { useTheme } from '~/shared/hooks/use-theme';
import { useTranslate } from '~/shared/hooks/use-translate';
import { ModalLayout } from '~/shared/layouts/modal-layout';
import { createStylesheet } from '~/shared/styles/create-stylesheet';
import { Translations } from '~/translations/Translations';
import { Step1 } from '../children/step-1';
import { Step2 } from '../children/step-2';

export const OnboardingModal = React.memo(() => {
  const styles = useStyles(getStyles);
  const theme = useTheme();
  const translate = useTranslate();

  const navigation = useNavigation();
  const handleEnd = useCallback(() => {
    navigation.goBack();
  }, []);

  const { currentStep, totalSteps, title, description, handleNext, children } =
    useOnboardingController({
      handleEnd,
    });

  return (
    <ModalLayout useScrollView={false} hideHeader>
      <View style={styles.childrenContainer}>{children}</View>
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Title1>{title}</Title1>
            <Body textAlign="center" color={theme.colors.subtleForeground}>
              {description}
            </Body>
          </View>
          <Buttons.Primary
            text={
              currentStep === totalSteps - 1 ?
                translate('onboarding.startButton')
              : translate('onboarding.nextButton')
            }
            onPress={handleNext}
          />
        </View>
      </View>
    </ModalLayout>
  );
});

interface UseOnboardingControllerProps {
  handleEnd: () => void;
}

const useOnboardingController = ({ handleEnd }: UseOnboardingControllerProps) => {
  const [currentStep, setCurrentStep] =
    useState<keyof Translations['en']['onboarding']['pages']>(0);
  const totalSteps = 4;

  const translate = useTranslate();

  const title = useMemo(() => translate(`onboarding.pages.${currentStep}.title`), [currentStep]);
  const description = useMemo(
    () => translate(`onboarding.pages.${currentStep}.description`),
    [currentStep]
  );

  const children = useMemo(() => {
    switch (currentStep) {
      case 1:
        return <Step1 />;
      case 2:
        return <Step2 />;
      default:
        return <View />;
    }
  }, [currentStep]);

  const handleNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => (prev + 1) as typeof currentStep);
    } else {
      handleEnd();
    }
  }, [currentStep, handleEnd]);

  return {
    children,
    currentStep,
    totalSteps,
    title,
    description,
    handleNext,
  };
};

const getStyles = createStylesheet((theme) => ({
  childrenContainer: {
    flex: 1,
    paddingBottom: 400,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xlarge,
  },
  cardContainer: {
    width: '100%',
    height: 400,
    backgroundColor: theme.colors.subtleBackground,
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: theme.spacing.xlarge,
  },
  card: {
    borderRadius: theme.roundness.large,
    backgroundColor: theme.colors.subtleBackground,
    shadowColor: theme.colors.background,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    marginTop: -40,
    padding: 40,
    justifyContent: 'space-between',
    gap: 40,
  },
  cardHeader: {
    alignItems: 'center',
    gap: theme.spacing.xlarge,
    textAlign: 'center',
  },
}));
