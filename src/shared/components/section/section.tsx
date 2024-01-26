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
      <View style={styles.title}>
        <Typographies.Title1 color={styles.title.color}>{title}</Typographies.Title1>
      </View>
      <View style={styles.contentContainer}>{children}</View>
    </View>
  );
};

const getStyles = createStylesheet((theme) => ({
  container: {},
  title: {
    color: theme.colors.foreground,
    marginBottom: 12,
  },
  contentContainer: {
    marginTop: 4,
  },
}));
