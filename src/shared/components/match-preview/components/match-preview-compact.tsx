import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Iconify } from 'react-native-iconify';

import { MatchLabel } from './match-label';
import { MatchTeam } from './match-team';
import { useOpenGameDetailsModal } from '../hooks/use-open-game-details-modal';
import type { MatchPreviewProps } from '../match-preview';

import { MatchSpoilerProvider } from '~/shared/components/match-preview/contexts/match-spoiler-context';
import { Typographies } from '~/shared/components/typographies';
import { useStyles } from '~/shared/hooks/use-styles';
import { useTheme } from '~/shared/hooks/use-theme';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

export const MatchPreviewCompact = React.memo(({ match }: MatchPreviewProps) => {
  const styles = useStyles(getStyles);
  const theme = useTheme();

  const openGameDetailsModal = useOpenGameDetailsModal({ match });

  return (
    <TouchableOpacity style={styles.matchPreview} onPress={openGameDetailsModal}>
      <View style={styles.labelContainer}>
        <MatchLabel
          date={match.date}
          competitionName={match.matchDetails.competitionName}
          bo={match.matchDetails.bo}
          status={match.status}
        />
      </View>
      <View style={styles.teamsContainer2}>
        <MatchSpoilerProvider>
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
                    hideResultColor={theme.colors.subtleBackground}
                    changeLoserOpacity
                  />
                )
            )}
          </View>
        </MatchSpoilerProvider>
        <Iconify icon="solar:alt-arrow-right-outline" color={styles.arrowIcon.color} size={16} />
      </View>
    </TouchableOpacity>
  );
});

const renderTeamName = ({ teamName, foreground }: { teamName: string; foreground: string }) => {
  return <Typographies.Body color={foreground}>{teamName}</Typographies.Body>;
};

const renderTeamScore = ({ score, foreground }: { score: string; foreground: string }) => {
  return (
    <Typographies.Body color={foreground} verticalTrim>
      {score}
    </Typographies.Body>
  );
};

const getStyles = createStylesheet((theme) => ({
  matchPreview: {
    marginBottom: 16,
  },
  labelContainer: {
    marginBottom: 8,
  },
  teamsContainer: {
    flexDirection: 'column',
    flex: 1,
    gap: theme.spacing.xsmall,
  },
  teamsContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  arrowIcon: {
    color: theme.colors.subtleForeground,
  },
}));
