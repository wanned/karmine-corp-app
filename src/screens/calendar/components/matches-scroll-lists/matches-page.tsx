import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { MatchScore } from '~/shared/components/match/match-score';
import { MatchTeam } from '~/shared/components/match/match-team';
import { Typographies } from '~/shared/components/typographies';
import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';
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
      {matches.map(
        (match, matchIndex) =>
          match && (
            <MatchScore key={match.id} match={match}>
              {match.teams.map(
                (team, index) =>
                  team && (
                    <MatchTeam
                      // key={`${match.id}-${team.name}-${index}`}
                      key={`${matchIndex}-${team.name}-${index}`} // FIXME: We may not use index as key. match.id seems to exist but it not typed.
                      logo={team.logoUrl}
                      name={team.name}
                      isWinner={team.score?.isWinner}
                      score={
                        team.score === undefined ? '-'
                        : team.score.scoreType === 'top' ?
                          `TOP ${team.score.score}`
                        : team.score.score
                      }
                    />
                  )
              )}
            </MatchScore>
          )
      )}
    </View>
  );
});

const getStyles = createStylesheet((theme) => ({
  noMatchesContainer: {
    flex: 1,
    alignItems: 'center',
  },
}));
