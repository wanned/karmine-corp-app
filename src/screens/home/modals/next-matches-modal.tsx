import { NavigationContainerRef, useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Iconify } from 'react-native-iconify';

import { MatchScore } from '~/shared/components/match/match-score';
import { MatchTeam } from '~/shared/components/match/match-team';
import { Typographies } from '~/shared/components/typographies';
import { useNextMatches } from '~/shared/hooks/data/use-next-matches';
import { useStyles } from '~/shared/hooks/use-styles';
import { useTranslate } from '~/shared/hooks/use-translate';
import { RootStackParamList } from '~/shared/navigation';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

export const NextMatchesModal = React.memo(() => {
  const styles = useStyles(getStyles);

  const translate = useTranslate();

  const navigation = useNavigation<NavigationContainerRef<RootStackParamList>>();

  const matchs = useNextMatches();

  if (!matchs.length) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer}>
          <Iconify icon="solar:arrow-left-linear" size={28} color={styles.icon.color} />
        </TouchableOpacity>
        <View style={styles.noMatchesContainer}>
          <Typographies.Label>{translate('home.noMatches')}</Typographies.Label>
        </View>
      </View>
    );
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
                  <MatchTeam key={index} logo={team.logoUrl} name={team.name} score="-" />
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
    paddingBottom: 16,
  },
  iconContainer: {
    padding: 20,
  },
  icon: {
    color: theme.colors.foreground,
  },
}));
