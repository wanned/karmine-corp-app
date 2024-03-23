import React from 'react';
import { ScrollView, View, VirtualizedList } from 'react-native';

import { MatchScore } from '~/shared/components/match/match-score';
import { MatchTeam } from '~/shared/components/match/match-team';
import { Typographies } from '~/shared/components/typographies';
import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';
import { useMatchesResults } from '~/shared/hooks/data/use-matches-results';
import { useStyles } from '~/shared/hooks/use-styles';
import { useTranslate } from '~/shared/hooks/use-translate';
import { ModalLayout } from '~/shared/layouts/modal-layout';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

export const LastResultsModal = React.memo(() => {
  const styles = useStyles(getStyles);

  const translate = useTranslate();

  const matchs = useMatchesResults();

  if (!matchs?.length) {
    return (
      <ModalLayout>
        <View style={styles.noMatchesContainer}>
          <Typographies.Label verticalTrim>{translate('home.noMatches')}</Typographies.Label>
        </View>
      </ModalLayout>
    );
  }

  return (
    <ModalLayout useScrollView={false}>
      <View style={styles.matchesContainer}>
        <VirtualizedList<CoreData.Match>
          data={matchs}
          getItem={(data, index) => data[index]}
          getItemCount={(data) => data.length}
          keyExtractor={(match) => match.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: match }) =>
            match && (
              <MatchScore key={match.id} match={match}>
                {match.teams.map(
                  (team, index: number) =>
                    team && (
                      <MatchTeam
                        key={`${match.id}-${team.name}-${index}`}
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
          }
        />
      </View>
    </ModalLayout>
  );
});

const getStyles = createStylesheet((theme) => ({
  noMatchesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
}));
