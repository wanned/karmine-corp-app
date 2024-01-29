import React from 'react';
import { ScrollView, View, VirtualizedList } from 'react-native';

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

  if (!matchs.length) {
    return (
      <ModalLayout>
        <View style={styles.noMatchesContainer}>
          <Typographies.Label verticalTrim>{translate('home.noMatches')}</Typographies.Label>
        </View>
      </ModalLayout>
    );
  }

  return (
    <ModalLayout>
      {/*
        The horizontal ScrollView is a workaround for the VirtualizedList not working properly with the ModalLayout.
        "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality"
      */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        horizontal
        contentContainerStyle={styles.matchesContainer}>
        <VirtualizedList
          data={matchs}
          getItem={(data, index) => data[index]}
          getItemCount={(data) => data.length}
          keyExtractor={(item) => item.data.karmineEvent.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: { data: match } }) =>
            match && (
              <MatchScore
                key={match.id}
                date={match.date}
                status="upcoming"
                bo={'bo' in match.matchDetails ? match.matchDetails.bo : undefined}
                game={match.matchDetails.game}>
                {match.teams.map((team: { logoUrl: string; name: string }, index: number) => (
                  <MatchTeam
                    key={`${match.id}-${team.name}-${index}`}
                    logo={team.logoUrl}
                    name={team.name}
                    score="-"
                  />
                ))}
              </MatchScore>
            )
          }
        />
      </ScrollView>
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
