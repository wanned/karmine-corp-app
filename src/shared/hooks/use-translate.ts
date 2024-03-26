import { useCallback } from 'react';

import { useSettings } from './use-settings';
import { translate } from '../utils/translate';

export const useTranslate = () => {
  const language = useSettings().language;

  return useCallback(
    <K extends Parameters<typeof translate>[0]>(key: K) => translate<K>(key, language),
    [language]
  );
};
