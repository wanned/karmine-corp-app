import React from 'react';
import { View, VirtualizedList } from 'react-native';

import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';
import { MatchScore } from '~/shared/components/match/match-score';
import { MatchTeam } from '~/shared/components/match/match-team';
import { Typographies } from '~/shared/components/typographies';
import { useNextMatches } from '~/shared/hooks/data/use-next-matches';
import { useStyles } from '~/shared/hooks/use-styles';
import { useTranslate } from '~/shared/hooks/use-translate';
import { ModalLayout } from '~/shared/layouts/modal-layout';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

export const NextMatchesModal = React.memo(() => {
  const styles = useStyles(getStyles);

  const translate = useTranslate();

  const matchs = useNextMatches();

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
                        score="-"
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
    paddingHorizontal: 16,
    height: '100%',
    width: '100%',
  },
}));
