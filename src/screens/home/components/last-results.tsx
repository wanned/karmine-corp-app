import { View } from 'react-native';

import { MatchPreview } from '~/shared/components/match-preview/match-preview';
import { Section } from '~/shared/components/section/section';
import { useMatchesResults } from '~/shared/hooks/data/use-matches-results';
import { useStyles } from '~/shared/hooks/use-styles';
import { useTranslate } from '~/shared/hooks/use-translate';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface LastResultsProps {
  viewMoreButton?: React.ReactNode;
  max?: number;
}

export const LastResults = ({ viewMoreButton, max }: LastResultsProps) => {
  const styles = useStyles(getStyles);
  const translate = useTranslate();

  const matchs = useMatchesResults(max);

  if (!matchs?.length) {
    return null;
  }

  return (
    <Section title={translate('home.lastResultsTitle')}>
      <View style={styles.matchPreviews}>
        {matchs.map((match) => (
          <MatchPreview key={match.id} match={match} variant="normal" />
        ))}
        {viewMoreButton}
      </View>
    </Section>
  );
};

const getStyles = createStylesheet((theme) => ({
  matchPreviews: {
    gap: theme.spacing.xlarge,
  },
}));
