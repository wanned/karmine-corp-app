import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo } from 'react';
import { View } from 'react-native';

import { MatchLabel } from './match-label';
import { MatchTeam } from './match-team';
import { OutlinedNumber } from '../../card/card-content/outlined-numbers';
import { checkSingleNumber } from '../../card/utils/check-single-number';
import { Spacer } from '../../spacer/spacer';
import { TouchableScale } from '../../touchable-scale/touchable-scale';
import { MatchSpoilerProvider } from '../contexts/match-spoiler-context';
import { useOpenGameDetailsModal } from '../hooks/use-open-game-details-modal';
import { useShowResults } from '../hooks/use-show-results';
import { MatchPreviewProps } from '../match-preview';

import { useGameBackgroundImage } from '~/screens/home/hooks/use-game-background-image';
import { Typographies } from '~/shared/components/typographies';
import { useStyles } from '~/shared/hooks/use-styles';
import { useTheme } from '~/shared/hooks/use-theme';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

export const MatchPreviewNormal = React.memo(({ match }: MatchPreviewProps) => {
  return (
    <MatchSpoilerProvider>
      <MatchPreviewNormalWithoutSpoilerProvider match={match} />
    </MatchSpoilerProvider>
  );
});

const MatchPreviewNormalWithoutSpoilerProvider = React.memo(({ match }: MatchPreviewProps) => {
  const styles = useStyles(getStyles);
  const theme = useTheme();

  const openGameDetailsModal = useOpenGameDetailsModal({ match });
  const { showResults } = useShowResults();

  const gameImageAssets = useGameBackgroundImage();
  const gameImage = useMemo(
    () => gameImageAssets?.[match.matchDetails.competitionName],
    [gameImageAssets, match.matchDetails.competitionName]
  );

  const gradientColor = theme.colors.subtleBackground;

  return (
    <TouchableScale onPress={openGameDetailsModal} onLongPress={showResults}>
      <View style={styles.matchPreview}>
        {gameImage && (
          <Image
            source={{ uri: gameImage.uri }}
            cachePolicy="memory-disk"
            style={styles.backgroundImage}
          />
        )}
        <LinearGradient
          style={styles.backgroundImage}
          colors={[`${gradientColor}00`, `${gradientColor}33`, `${gradientColor}FF`]}
          locations={[0, 0.83, 1]}
        />
        <View style={[styles.backgroundImage, { backgroundColor: gradientColor, opacity: 0.94 }]} />
        <MatchLabel
          date={match.date}
          competitionName={match.matchDetails.competitionName}
          bo={match.matchDetails.bo}
          status={match.status}
        />
        <Spacer size={16} direction="vertical" />

        <View style={styles.teamsContainer}>
          {match.teams.map(
            (team, index) =>
              team && (
                <MatchTeam
                  key={`${match.id}-${team.name}-${index}`}
                  team={team}
                  renderTeamName={renderTeamName}
                  renderTeamScore={renderTeamScore}
                  crownSize={16}
                  logoSize={24}
                  hideResultColor={theme.colors.subtleForeground2}
                />
              )
          )}
        </View>
      </View>
    </TouchableScale>
  );
});

const renderTeamName = ({ teamName, foreground }: { teamName: string; foreground: string }) => {
  return (
    <Typographies.Title3 color={foreground} verticalTrim>
      {teamName}
    </Typographies.Title3>
  );
};

const renderTeamScore = ({
  score,
  isWinner,
  foreground,
}: {
  score: string;
  isWinner: boolean | undefined;
  foreground: string;
}) => {
  return isWinner === undefined || isWinner || !checkSingleNumber(score) ?
      <View style={{ height: 13 }}>
        <Typographies.Title2 color={foreground} verticalTrim>
          {score}
        </Typographies.Title2>
      </View>
    : <OutlinedNumber size={{ width: 10, height: 13 }}>{score}</OutlinedNumber>;
};

const getStyles = createStylesheet((theme) => ({
  matchPreview: {
    padding: theme.margins.screenHorizontal,
    backgroundColor: theme.colors.background,
    borderRadius: theme.roundness.xlarge,
    overflow: 'hidden',
    borderColor: theme.colors.subtleForeground2,
    borderWidth: 1,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  teamsContainer: {
    gap: theme.spacing.small,
  },
}));
