import { NavigationContainerRef, useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity, View, VirtualizedList } from 'react-native';
import { Iconify } from 'react-native-iconify';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MatchScore } from '~/shared/components/match/match-score';
import { MatchTeam } from '~/shared/components/match/match-team';
import { Typographies } from '~/shared/components/typographies';
import { useMatchesResults } from '~/shared/hooks/data/use-matches-results';
import { useStyles } from '~/shared/hooks/use-styles';
import { useTranslate } from '~/shared/hooks/use-translate';
import { RootStackParamList } from '~/shared/navigation';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

export const LastResultsModal = React.memo(() => {
  const styles = useStyles(getStyles);

  const translate = useTranslate();

  const safeAreaInsets = useSafeAreaInsets();

  const navigation = useNavigation<NavigationContainerRef<RootStackParamList>>();

  const matchs = useMatchesResults();

  if (!matchs.length) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ ...styles.iconContainer, marginTop: safeAreaInsets.top }}>
          <Iconify icon="solar:arrow-left-linear" size={28} color={styles.icon.color} />
        </TouchableOpacity>
        <View style={styles.noMatchesContainer}>
          <Typographies.Label>{translate('home.noMatches')}</Typographies.Label>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ ...styles.iconContainer, marginTop: safeAreaInsets.top }}>
        <Iconify icon="solar:arrow-left-linear" size={28} color={styles.icon.color} />
      </TouchableOpacity>
      <View style={styles.matchesContainer}>
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
                {match.teams.map(
                  (
                    team: {
                      logoUrl: string;
                      name: string;
                      score:
                        | {
                            isWinner: boolean | undefined;
                            scoreType: string;
                            score: string | number;
                          }
                        | undefined;
                    },
                    index: number
                  ) => (
                    <MatchTeam
                      key={`${match.id}-${team.name}-${index}`}
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
                  )
                )}
              </MatchScore>
            )
          }
        />
      </View>
    </View>
  );
});

const getStyles = createStylesheet((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  noMatchesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchesContainer: {
    marginTop: 8,
    paddingHorizontal: 16,
    flex: 1,
  },
  iconContainer: {
    padding: 20,
  },
  icon: {
    color: theme.colors.foreground,
  },
}));
