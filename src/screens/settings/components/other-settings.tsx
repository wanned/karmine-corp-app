import { NavigationContainerRef, useNavigation } from '@react-navigation/native';
import { Linking, Pressable, View } from 'react-native';
import { Iconify } from 'react-native-iconify';

import { Typographies } from '~/shared/components/typographies';
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

  return (
    <View style={styles.ButtonContainer}>
      {buttons.map((button, index) => (
        <Button key={index} title={button.title} redirectTo={button.redirectTo} />
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

const Button = ({ title, redirectTo }: ButtonProps) => {
  const navigation = useNavigation<NavigationContainerRef<RootStackParamList>>();

  const styles = useStyles(getButtonStyle);

  const navigateOrOpenURL = (redirectTo: string) => {
    const isUrl = /^(http|https):\/\/[^ "]+$/.test(redirectTo);

    if (isUrl) {
      Linking.openURL(redirectTo);
    } else {
      navigation.navigate(redirectTo as keyof RootStackParamList);
    }
  };

  const handlePress = () => {
    navigateOrOpenURL(redirectTo);
  };

  return (
    <Pressable onPress={handlePress}>
      <View style={styles.buttonContainer}>
        <Typographies.Body verticalTrim>{title}</Typographies.Body>
        <Iconify icon="solar:arrow-right-linear" size={20} color={styles.iconColor.color} />
      </View>
    </Pressable>
  );
};

const getButtonStyle = createStylesheet((theme) => ({
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.subtleBackground,
    borderRadius: 8,
  },
  iconColor: {
    color: theme.colors.foreground,
  },
}));
