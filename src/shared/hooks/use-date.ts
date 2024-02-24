import { format } from 'date-fns';
import { fr, enUS, es } from 'date-fns/locale';
import { useCallback } from 'react';

import { useSettings } from './use-settings';
import { IsoDate } from '../types/IsoDate';

import { Language } from '~/translations/Translations';

export const useDate = () => {
  const language = useSettings().language;

  const formatDate = useCallback(
    (date: Date | IsoDate, formatString: string = 'dd MMM yyyy') => {
      return format(date, formatString, {
        locale: getDateFormatLanguage(language),
      });
    },
    [language]
  );

  const formatTime = useCallback(
    (date: Date | IsoDate, formatString: string = "HH'H'") => {
      return format(date, formatString, {
        locale: getDateFormatLanguage(language),
      });
    },
    [language]
  );

  return {
    formatDate,
    formatTime,
  };
};

const getDateFormatLanguage = (language: Language) => {
  switch (language) {
    case 'fr': {
      return fr;
    }
    case 'es': {
      return es;
    }
    case 'en': {
      return enUS;
    }
  }

  return enUS;
};
