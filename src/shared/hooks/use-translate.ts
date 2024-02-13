import { useCallback } from 'react';

import { useSettings } from './use-settings';
import { translate } from '../utils/translate';

export const useTranslate = () => {
  const language = useSettings().language;

  return useCallback(
    (key: Parameters<typeof translate>[0]) => translate(key, language),
    [language]
  );
};
