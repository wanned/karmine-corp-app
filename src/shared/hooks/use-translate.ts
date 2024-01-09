import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import { useCallback } from 'react';

import { useSettings } from './use-settings';

import { translations } from '~/translations';
import { Translations } from '~/translations/Translations';

const i18n = new I18n(translations);

i18n.locale = Localization.locale;
i18n.enableFallback = true;

export const useTranslate = () => {
  const language = useSettings().language;

  return useCallback(
    (key: TranslationKeys) => {
      if (language !== undefined) {
        i18n.locale = language;
      }
      return i18n.t(key);
    },
    [language]
  );
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
