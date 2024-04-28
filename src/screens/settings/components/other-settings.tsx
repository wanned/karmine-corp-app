import { Linking, View } from 'react-native';

import { Buttons } from '~/shared/components/buttons';
import { useNavigation } from '~/shared/hooks/use-navigation';
import { useStyles } from '~/shared/hooks/use-styles';
import { useTranslate } from '~/shared/hooks/use-translate';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface ButtonProps {
  title: string;
  redirectTo: string;
}

export const OtherSettings = () => {
  const styles = useStyles(getStyles);

  const navigation = useNavigation();

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
      redirectTo: 'credits',
    },
  ];

  const navigateOrOpenURL = (redirectTo: string) => {
    const isUrl = /^(http|https):\/\/[^ "]+$/.test(redirectTo);

    if (isUrl) {
      Linking.openURL(redirectTo);
    } else {
      navigation.navigate(redirectTo as never);
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
