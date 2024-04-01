import { Image } from 'expo-image';
import React, { useMemo } from 'react';
import { View, Pressable } from 'react-native';
import { Iconify } from 'react-native-iconify';

import { usePrintableScore } from '../hooks/use-printable-score';
import { useShowResults } from '../hooks/use-show-results';

import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';
import { createStylesheet } from '~/shared/styles/create-stylesheet';
import { styleTokens } from '~/shared/styles/tokens';

interface MatchTeamProps {
  team: CoreData.BaseMatch['teams'][number];
  renderTeamName: (params: { teamName: string; foreground: string }) => React.ReactNode;
  renderTeamScore: (params: {
    score: string;
    isWinner: boolean | undefined;
    foreground: string;
  }) => React.ReactNode;
  logoSize: number;
  crownSize: number;
  hideResultColor: string;
}

export const MatchTeam = React.memo(
  ({
    team,
    renderTeamName,
    renderTeamScore,
    logoSize,
    crownSize,
    hideResultColor,
  }: MatchTeamProps) => {
    const styles = getMatchTeamStyles(styleTokens);

    const { resultsShown } = useShowResults();

    const teamNameElement = useMemo(
      () =>
        team !== null &&
        renderTeamName({ teamName: team.name, foreground: styles.teamScore.color }),
      [team?.name, renderTeamName]
    );

    if (team === null) return null;

    return (
      <View style={styles.matchTeam}>
        <Image
          source={{ uri: team.logoUrl }}
          cachePolicy="memory-disk"
          style={[
            styles.teamLogo,
            {
              width: logoSize,
              height: logoSize,
            },
          ]}
        />
        {teamNameElement}
        {resultsShown && team.score?.isWinner && (
          <Iconify
            icon="solar:crown-bold"
            size={crownSize}
            color={styles.crown.color}
            style={styles.crown}
          />
        )}
        <ScoreText
          score={team.score}
          renderTeamScore={renderTeamScore}
          hideResultColor={hideResultColor}
        />
      </View>
    );
  }
);

const getMatchTeamStyles = createStylesheet((tokens) => ({
  matchTeam: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamLogo: {
    marginRight: tokens.spacing.large,
  },
  teamScore: {
    color: tokens.colors.foreground,
  },
  crown: {
    position: 'relative',
    color: '#F9D370',
    top: -1.5,
    marginLeft: tokens.spacing.medium,
  },
}));

interface ScoreTextProps {
  score: CoreData.Score | undefined;
  renderTeamScore: Pick<MatchTeamProps, 'renderTeamScore'>['renderTeamScore'];
  hideResultColor: string;
}

const ScoreText = React.memo(({ score, renderTeamScore, hideResultColor }: ScoreTextProps) => {
  const styles = getScoreTextStyles(styleTokens);

  const { resultsShown, showResults } = useShowResults();
  const printableScore = usePrintableScore({ score });

  const scoreElement = useMemo(
    () =>
      renderTeamScore({
        score: printableScore ?? '-',
        isWinner: score?.isWinner,
        foreground: styles.scoreText.color,
      }),
    [printableScore, renderTeamScore]
  );

  return (
    <View style={styles.scoreText}>
      {scoreElement}
      {!resultsShown && printableScore !== undefined && (
        <Pressable
          onPress={showResults}
          style={[
            styles.spoilerRectangle,
            {
              backgroundColor: hideResultColor,
            },
          ]}
        />
      )}
    </View>
  );
});

const getScoreTextStyles = createStylesheet((tokens) => ({
  scoreText: {
    marginLeft: 'auto',
    color: tokens.colors.foreground,
  },
  spoilerRectangle: {
    position: 'absolute',
    top: -tokens.spacing.small,
    bottom: -tokens.spacing.small,
    left: -tokens.spacing.small,
    right: -tokens.spacing.small,
    borderRadius: tokens.roundness.small,
  },
}));
