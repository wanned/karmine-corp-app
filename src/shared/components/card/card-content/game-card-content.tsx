import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { LivePill } from '../../live-pill/live-pill';
import { MatchLabel } from '../../match-preview/components/match-label';
import { TouchableScale } from '../../touchable-scale/touchable-scale';
import { Typographies } from '../../typographies';
import { checkSingleNumber } from '../utils/check-single-number';

import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';
import { OutlinedNumber } from '~/shared/components/card/card-content/outlined-numbers';
import { useStyles } from '~/shared/hooks/use-styles';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface GameCardContentProps {
  match: CoreData.Match;
  showLivePill?: boolean;
  onPress: () => void;
}

export const GameCardContent = ({ match, showLivePill = false, onPress }: GameCardContentProps) => {
  const styles = useStyles(getStyles);

  const teamLeft = match.teams[0];
  const teamRight = match.teams[1];

  return (
    <TouchableScale onPress={onPress}>
      <View>
        <View style={styles.header}>
          <MatchLabel
            competitionName={match.matchDetails.competitionName}
            status={match.status}
            bo={match.matchDetails.bo}
            subtleColor={false}
            showLivePill={false}
          />
          {showLivePill && (
            <View style={styles.livePill}>
              <LivePill />
            </View>
          )}
        </View>
        <View style={styles.teamsContainer}>
          <TeamScore {...teamLeft} position="left" />
          {teamRight && <TeamScore {...teamRight} position="right" />}
        </View>
      </View>
    </TouchableScale>
  );
};

const getStyles = createStylesheet((theme) => ({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    color: theme.colors.foreground,
    marginBottom: 8,
  },
  livePill: {
    position: 'absolute',
    right: 0,
    top: -6,
  },
  teamsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    marginTop: 8,
  },
}));

type TeamScoreProps = {
  position: 'left' | 'right';
} & CoreData.Match['teams'][number];

const TeamScore = ({ logoUrl, name, score, position }: TeamScoreProps) => {
  const styles = useStyles(getTeamsScoreStyles);

  return (
    <View
      style={StyleSheet.compose(
        styles.teamContainer,
        position === 'left' ? styles.teamContainerLeft : styles.teamContainerRight
      )}>
      <View style={styles.teamNameContainer}>
        <Image
          source={{ uri: logoUrl }}
          cachePolicy="memory-disk"
          style={{ width: 70, height: 70 }}
        />
        <Typographies.Title3 color={styles.teamNameContainer.color}>{name}</Typographies.Title3>
      </View>

      {score !== undefined &&
        (score.isWinner ?
          <Typographies.VeryBig color={styles.teamNameContainer.color} verticalTrim>
            {score.score.toString()}
          </Typographies.VeryBig>
        : checkSingleNumber(score.score) ?
          <OutlinedNumber size="small">{score.score}</OutlinedNumber>
        : <Typographies.VeryBig color={styles.teamNameContainer.color} verticalTrim>
            {score.score.toString()}
          </Typographies.VeryBig>)}
    </View>
  );
};

const getTeamsScoreStyles = createStylesheet((theme) => ({
  teamNameContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: theme.colors.foreground,
    paddingVertical: 2,
  },
  teamContainer: {
    alignItems: 'center',
    gap: 20,
  },
  teamContainerLeft: {
    flexDirection: 'row',
  },
  teamContainerRight: {
    flexDirection: 'row-reverse',
  },
}));
