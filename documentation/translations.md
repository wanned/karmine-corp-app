# Translations

## Usage

```tsx
import { useTranslate } from '~/shared/hooks/use-translate';

const Component = () => {
  const translate = useTranslate();

  return <div>{translate('key')}</div>;
};
```

> [!NOTE]
> The keys for the `translate` function are typed.

## Adding a translation

To add a translation you need to add a key to the `TranslationKeys` type in `src/shared/translations/Translations.d.ts`:

```ts
export type Translations = Record<
  // ...
  {
    yourScreen: {
      yourKey: string;
    };
  }
>;
```

Then you need to add a translation to the `translations` object in the language files (for example `src/shared/translations/en.ts`):

```ts
export const enTranslations: Translations['en'] = {
  // ...
  yourScreen: {
    yourKey: 'Your translation',
  },
};
```

## Adding a language

To add a language you need to add a key to the `Languages` type in `src/shared/translations/Translations.d.ts`:

```ts
// For example, add 'fr' if there is already 'en'
type Language = 'en' | 'fr';
```

Then you need to create a language file (for example `src/shared/translations/fr.ts`):

```ts
export const frTranslations: Translations['fr'] = {
  // ...
};
```

Then you need to add the language to the `languages` object in `src/shared/translations/index.ts`:

```ts
export const translations: Translations = {
  // ...
  fr: frTranslations,
};
```
