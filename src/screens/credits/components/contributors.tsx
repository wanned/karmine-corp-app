import { Linking, View } from 'react-native';

import { useContributors } from '../hooks/use-contributors';

import { Buttons } from '~/shared/components/buttons';
import { useStyles } from '~/shared/hooks/use-styles';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface ContributorProps {
  user: {
    name: string;
    username: string;
    twitter: string;
  };
}

export const Contributors = () => {
  const { data: contributors } = useContributors();
  const styles = useStyles(getStyles);

  const redirect = (contributor: ContributorProps) => {
    if (contributor.user.twitter) {
      Linking.openURL(`https://x.com/${contributor.user.twitter}`);
    } else {
      Linking.openURL(`https://github.com/${contributor.user.username}`);
    }
  };

  return (
    <View style={styles.ButtonContainer}>
      {contributors?.map((contributor, index) => (
        <Buttons.Secondary
          key={index}
          text={contributor.user.name || contributor.user.username}
          onPress={() => redirect(contributor)}
          fillWidth
          withArrow
        />
      ))}
    </View>
  );
};

const getStyles = createStylesheet((theme) => ({
  ButtonContainer: {
    gap: 8,
  },
}));
