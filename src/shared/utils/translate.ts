import { I18n } from 'i18n-js';

import { translations } from '~/translations';
import { Translations } from '~/translations/Translations';

const i18n = new I18n(translations);

i18n.enableFallback = true;

export const translate = (key: TranslationKeys, language?: string) => {
  if (language !== undefined) {
    i18n.locale = language;
  }
  return i18n.t(key);
};

type TranslationKeys<
  TranslationObject extends Record<string, any> = Translations['en'],
  Prefix extends string = '',
> = {
  [Key in keyof TranslationObject]: Key extends string | number ?
    TranslationObject[Key] extends Record<string, any> ?
      TranslationKeys<TranslationObject[Key], `${Prefix}${Key}.`>
    : `${Prefix}${Key}`
  : never;
}[keyof TranslationObject];
