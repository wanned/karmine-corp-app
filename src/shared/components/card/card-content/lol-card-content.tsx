import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { LivePill } from '../../live-pill/live-pill';
import { Typographies } from '../../typographies';

import { useStyles } from '~/shared/hooks/use-styles';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface TeamProps {
  logo: string;
  name: string;
  score: string | number;
  isWinner?: boolean;
}

interface LolCardContentProps {
  teamLeft: TeamProps;
  teamRight: TeamProps;
}

export const LolCardContent = ({ teamLeft, teamRight }: LolCardContentProps) => {
  const styles = useStyles(getStyles);

  return (
    <View>
      <View style={styles.header}>
        <Typographies.Label color={styles.header.color}>
          17 SEPT. 2023 · LEC · BO5
        </Typographies.Label>
        <View style={styles.livePill}>
          <LivePill />
        </View>
      </View>
      <View style={styles.teamsContainer}>
        <TeamScore {...teamLeft} position="left" />
        <TeamScore {...teamRight} position="right" />
      </View>
    </View>
  );
};

const getStyles = createStylesheet((theme) => ({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    color: theme.colors.foreground,
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

interface TeamScoreProps extends TeamProps {
  position: 'left' | 'right';
}

const TeamScore = ({ logo, name, score, isWinner, position }: TeamScoreProps) => {
  const styles = useStyles(getTeamsScoreStyles);

  const scoreElement = (
    <Typographies.VeryBig color={styles.teamNameContainer.color}>
      {score.toString()}
    </Typographies.VeryBig>
  );

  return (
    <View
      style={StyleSheet.compose(
        styles.teamContainer,
        position === 'left' ? styles.teamContainerLeft : styles.teamContainerRight
      )}>
      <View style={styles.teamNameContainer}>
        <Image source={{ uri: logo }} cachePolicy="memory-disk" style={{ width: 70, height: 70 }} />
        <Typographies.Title3 color={styles.teamNameContainer.color}>{name}</Typographies.Title3>
      </View>

      {scoreElement}
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