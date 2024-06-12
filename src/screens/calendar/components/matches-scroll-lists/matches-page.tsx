import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';
import { MatchPreview } from '~/shared/components/match-preview/match-preview';
import { Typographies } from '~/shared/components/typographies';
import { useStyles } from '~/shared/hooks/use-styles';
import { useTranslate } from '~/shared/hooks/use-translate';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface MatchesListProps {
  matches: CoreData.Match[];
}

export const MatchesList = React.memo(({ matches }: MatchesListProps) => {
  const { width: screenWidth } = useWindowDimensions();
  const translate = useTranslate();
  const styles = useStyles(getStyles);

  if (matches.length === 0) {
    return (
      <View
        style={StyleSheet.compose(
          { width: screenWidth, paddingHorizontal: 16 },
          styles.noMatchesContainer
        )}>
        <Typographies.Label>{translate('calendar.noMatchesToday')}</Typographies.Label>
      </View>
    );
  }

  return (
    <View style={{ width: screenWidth, paddingHorizontal: 16 }}>
      {matches
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((match) => match && <MatchPreview key={match.id} match={match} variant="compact" />)}
    </View>
  );
});

const getStyles = createStylesheet((theme) => ({
  noMatchesContainer: {
    flex: 1,
    alignItems: 'center',
  },
}));
