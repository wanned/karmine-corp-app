import { NavigationContainerRef, useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Iconify } from 'react-native-iconify';

import { MatchScore } from '~/shared/components/match/match-score';
import { MatchTeam } from '~/shared/components/match/match-team';
import { useMatchesResults } from '~/shared/hooks/data/use-matches-results';
import { useStyles } from '~/shared/hooks/use-styles';
import { RootStackParamList } from '~/shared/navigation';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

export const LastResultsModal = React.memo(() => {
  const styles = useStyles(getStyles);

  const navigation = useNavigation<NavigationContainerRef<RootStackParamList>>();

  const matchs = useMatchesResults();

  if (!matchs.length) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer}>
        <Iconify icon="solar:arrow-left-linear" size={28} color={styles.icon.color} />
      </TouchableOpacity>
      <View style={styles.matchesContainer}>
        {matchs.map(
          ({ data: match }, index) =>
            match && (
              <MatchScore
                key={index}
                date={match.date}
                status="upcoming"
                bo={'bo' in match.matchDetails ? match.matchDetails.bo : undefined}
                game={match.matchDetails.game}>
                {match.teams.map((team, index) => (
                  <MatchTeam
                    key={index}
                    logo={team.logoUrl}
                    name={team.name}
                    isWinner={team.score?.isWinner}
                    score={
                      team.score === undefined
                        ? '-'
                        : team.score.scoreType === 'top'
                          ? `TOP ${team.score.score}`
                          : team.score.score
                    }
                  />
                ))}
              </MatchScore>
            )
        )}
      </View>
    </ScrollView>
  );
});

const getStyles = createStylesheet((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
  },
  matchesContainer: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  iconContainer: {
    padding: 20,
  },
  icon: {
    color: theme.colors.foreground,
  },
}));
