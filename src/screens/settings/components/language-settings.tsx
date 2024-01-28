import { Pressable, StyleSheet, View } from 'react-native';

import { Typographies } from '~/shared/components/typographies';
import { useStyles } from '~/shared/hooks/use-styles';
import { useTranslate } from '~/shared/hooks/use-translate';
import { createStylesheet } from '~/shared/styles/create-stylesheet';
import { Settings } from '~/shared/types/Settings';
import { translations } from '~/translations';
import { Language } from '~/translations/Translations';

export function LanguageSettings({
  languageSettings,
  setLanguageSettings,
}: {
  languageSettings: Settings['language'];
  setLanguageSettings: (language: Settings['language']) => void;
}) {
  const styles = useStyles(getStyles);

  const availableLanguages = Object.keys(translations) as (keyof typeof translations)[];

  return (
    <View style={styles.radioContainer}>
      {availableLanguages.map((language) => (
        <LanguageRadio
          key={language}
          languageSelected={languageSettings}
          setLanguageSelected={setLanguageSettings}
          language={language}
        />
      ))}
    </View>
  );
}

function LanguageRadio({
  languageSelected,
  setLanguageSelected,
  language,
}: {
  languageSelected: Language;
  setLanguageSelected: (language: Language) => void;
  language: Language;
}) {
  const styles = useStyles(getRadioStyles);
  const translate = useTranslate();

  const isSelected = languageSelected === language;

  return (
    <Pressable onPress={() => setLanguageSelected(language)}>
      <View style={styles.container}>
        <Typographies.Body verticalTrim>
          {translate(`settings.language.languages.${language}`)}
        </Typographies.Body>
        <View style={styles.radio}>
          <View
            style={StyleSheet.compose(styles.radioInner, isSelected && styles.radioInnerSelected)}
          />
        </View>
      </View>
    </Pressable>
  );
}

const getStyles = createStylesheet((theme) => ({
  radioContainer: {
    gap: 8,
  },
}));

const getRadioStyles = createStylesheet((theme) => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.subtleBackground,
    borderRadius: 8,
  },
  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.colors.accent,
    padding: 2,
  },
  radioInner: {
    flex: 1,
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  radioInnerSelected: {
    backgroundColor: theme.colors.accent,
  },
}));
