import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import { View } from 'react-native';
import { Buttons } from '~/shared/components/buttons';
import { Body } from '~/shared/components/typographies/body';
import { Title1 } from '~/shared/components/typographies/title1';
import { useNavigation } from '~/shared/hooks/use-navigation';

import { useStyles } from '~/shared/hooks/use-styles';
import { useTheme } from '~/shared/hooks/use-theme';
import { useTranslate } from '~/shared/hooks/use-translate';
import { ModalLayout } from '~/shared/layouts/modal-layout';
import { ModalsParamList } from '~/shared/navigation';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface OnboardingModalProps extends NativeStackScreenProps<ModalsParamList, 'onboardingModal'> {}

export const OnboardingModal = React.memo(
  ({
    route: {
      params: { children, title, description, currentStep, totalSteps },
    },
  }: OnboardingModalProps) => {
    const styles = useStyles(getStyles);

    const theme = useTheme();

    const navigation = useNavigation();

    const translate = useTranslate();

    const handleNext = useCallback(() => {
      console.log({ currentStep, totalSteps });
      if (currentStep < totalSteps - 1) {
        const nextStep = (currentStep + 1) as typeof currentStep;

        console.log({ nextStep });

        navigation.replace('onboardingModal', {
          title: translate(`onboarding.pages.${nextStep}.title`),
          description: translate(`onboarding.pages.${nextStep}.description`),
          currentStep: nextStep,
          totalSteps,
        });
      } else {
        navigation.pop();
      }
    }, [currentStep, totalSteps]);

    return (
      <ModalLayout useScrollView={false} hideHeader>
        {children}
        <View style={styles.container}>
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
  }
);

const getStyles = createStylesheet((theme) => ({
  container: {
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
