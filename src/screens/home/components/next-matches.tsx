import React from 'react';
import { View } from 'react-native';

import { MatchPreview } from '~/shared/components/match-preview/match-preview';
import { Section } from '~/shared/components/section/section';
import { useNextMatches } from '~/shared/hooks/data/use-next-matches';
import { useStyles } from '~/shared/hooks/use-styles';
import { useTranslate } from '~/shared/hooks/use-translate';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface NextMatchesProps {
  viewMoreButton?: React.ReactNode;
  max?: number;
}

export const NextMatches = ({ viewMoreButton, max }: NextMatchesProps) => {
  const styles = useStyles(getStyles);
  const translate = useTranslate();

  const matchs = useNextMatches(max);

  if (!matchs?.length) {
    return null;
  }

  return (
    <Section title={translate('home.nextMatchesTitle')}>
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
