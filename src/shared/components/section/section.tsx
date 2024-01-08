import { View } from 'react-native';

import { Typographies } from '~/shared/components/typographies';
import { createStylesheet } from '~/shared/styles/create-stylesheet';
import { styleTokens } from '~/shared/styles/tokens';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export const Section = ({ title, children }: SectionProps) => {
  const styles = getStyles(styleTokens);

  return (
    <View style={styles.container}>
      <Typographies.Title1 color={styles.title.color}>{title}</Typographies.Title1>
      <View style={styles.contentContainer}>{children}</View>
    </View>
  );
};

const getStyles = createStylesheet((theme) => ({
  container: {},
  title: {
    color: theme.colors.foreground,
  },
  contentContainer: {
    marginTop: 4,
  },
}));
