import { NavigationContainerRef, useNavigation } from '@react-navigation/native';
import { Linking, View } from 'react-native';

import { Buttons } from '~/shared/components/buttons';
import { useStyles } from '~/shared/hooks/use-styles';
import { useTranslate } from '~/shared/hooks/use-translate';
import { RootStackParamList } from '~/shared/navigation';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface ButtonProps {
  title: string;
  redirectTo: string;
}

export const OtherSettings = () => {
  const styles = useStyles(getStyles);

  const navigation = useNavigation<NavigationContainerRef<RootStackParamList>>();

  const translate = useTranslate();

  const buttons: ButtonProps[] = [
    {
      title: translate('settings.other.buttonTitles.bugReport'),
      redirectTo: 'https://github.com/wanned/karmine-corp-app/issues/new',
    },
    {
      title: translate('settings.other.buttonTitles.karmineCorpWebsite'),
      redirectTo: 'https://www.karminecorp.fr/',
    },
    {
      title: translate('settings.other.buttonTitles.karmineCorpTwitter'),
      redirectTo: 'https://x.com/KarmineCorp',
    },
    {
      title: translate('settings.other.buttonTitles.credits'),
      // TODO: Add credits screen redirect
      redirectTo: 'home',
    },
  ];

  const navigateOrOpenURL = (redirectTo: string) => {
    const isUrl = /^(http|https):\/\/[^ "]+$/.test(redirectTo);

    if (isUrl) {
      Linking.openURL(redirectTo);
    } else {
      navigation.navigate(redirectTo as keyof RootStackParamList);
    }
  };

  return (
    <View style={styles.ButtonContainer}>
      {buttons.map((button, index) => (
        <Buttons.Secondary
          key={index}
          text={button.title}
          onPress={() => navigateOrOpenURL(button.redirectTo)}
          fillWidth
          withArrow
        />
      ))}
    </View>
  );
};

const getStyles = createStylesheet((theme) => ({
  ButtonContainer: {
    marginTop: 12,
    gap: 8,
  },
}));
