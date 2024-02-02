import { createContext, useState } from 'react';

export interface OnboardingContextValue {
  currentStep: 1 | 2 | 3 | 4 | 5;
  setCurrentStep: (currentStep: OnboardingContextValue['currentStep']) => void;
}

export const OnboardingContext = createContext<OnboardingContextValue>({
  currentStep: 1,
  setCurrentStep: () => {},
});

export const OnboardingContextProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value?: OnboardingContextValue;
}) => {
  const [currentStep, setCurrentStep] = useState<OnboardingContextValue['currentStep']>(
    value?.currentStep ?? 1
  );

  return (
    <OnboardingContext.Provider value={{ currentStep, setCurrentStep }}>
      {children}
    </OnboardingContext.Provider>
  );
};
