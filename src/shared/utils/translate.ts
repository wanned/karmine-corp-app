import { I18n } from 'i18n-js';

import { translations } from '~/translations';
import { Translations } from '~/translations/Translations';

const i18n = new I18n(translations);

i18n.enableFallback = true;

export const translate = <K extends TranslationKeys>(
  key: K,
  language?: string
): TranslationValue<K> => {
  if (language !== undefined) {
    i18n.locale = language;
  }

  return i18n.t<string | TranslationValue<K>>(key) as any;
};

type TranslationKeys<
  _TranslationObject extends Record<string, unknown> = Translations['en'],
  _Prefix extends string = '',
> = {
  [Key in keyof _TranslationObject]: Key extends string | number ?
    _TranslationObject[Key] extends Record<string, unknown> ?
      TranslationKeys<_TranslationObject[Key], `${_Prefix}${Key}.`>
    : `${_Prefix}${Key}`
  : never;
}[keyof _TranslationObject];

type TranslationValue<
  Key extends TranslationKeys,
  _Key extends string = Key,
  _TranslationObject extends Record<string, any> = Translations['en'],
> = _Key extends `${infer Prefix}.${infer Rest}` ?
  TranslationValue<Key, Rest, _TranslationObject[Prefix]>
: _Key extends keyof _TranslationObject ? _TranslationObject[_Key]
: never;
