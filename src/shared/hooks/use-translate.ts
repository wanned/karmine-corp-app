import { setDefaultOptions } from 'date-fns';
import { fr, enUS, es } from 'date-fns/locale';
import * as Localization from 'expo-localization';
import { I18n, TranslateOptions } from 'i18n-js';
import { useCallback } from 'react';

import { translations } from '~/translations';
import { Translations } from '~/translations/Translations';

const i18n = new I18n(translations);

i18n.locale = Localization.locale;
i18n.enableFallback = true;

setDefaultOptions({
  locale: Localization.locale === 'fr' ? fr : Localization.locale === 'es' ? es : enUS,
});

export const useTranslate = () => {
  return useCallback((key: TranslationKeys, options?: TranslateOptions) => {
    return i18n.t(key, options);
  }, []);
};

type TranslationKeys<
  TranslationObject extends Record<string, any> = Translations['en'],
  Prefix extends string = '',
> = {
  [Key in keyof TranslationObject]: Key extends string | number
    ? TranslationObject[Key] extends Record<string, any>
      ? TranslationKeys<TranslationObject[Key], `${Prefix}${Key}.`>
      : `${Prefix}${Key}`
    : never;
}[keyof TranslationObject];
