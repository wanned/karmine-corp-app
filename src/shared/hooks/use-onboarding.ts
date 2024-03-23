import { useContext } from 'react';

import { OnboardingContext } from '../contexts/onboarding-context';

export const useOnboarding = () => {
  return useContext(OnboardingContext);
};
