import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { LivePill } from '../../live-pill/live-pill';
import { Typographies } from '../../typographies';
import { checkSingleNumber } from '../utils/check-single-number';

import { OutlinedNumber } from '~/shared/components/card/card-content/outlined-numbers';
import { useStyles } from '~/shared/hooks/use-styles';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface TeamProps {
  logo: string;
  name: string;
  score?: string | number;
  isWinner?: boolean;
}

interface GameCardContentProps {
  teamLeft: TeamProps;
  teamRight?: TeamProps;
  showLivePill?: boolean;
  onPress?: () => void;
}

export const GameCardContent = ({
  teamLeft,
  teamRight,
  showLivePill = false,
  onPress,
}: GameCardContentProps) => {
  const styles = useStyles(getStyles);

  return (
    <Pressable onPress={onPress}>
      <View>
        <View style={styles.header}>
          <Typographies.Label color={styles.header.color} verticalTrim>
            17 SEPT. 2023 · LEC · BO5
          </Typographies.Label>
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
    </Pressable>
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

interface TeamScoreProps extends TeamProps {
  position: 'left' | 'right';
}

const TeamScore = ({ logo, name, score, isWinner, position }: TeamScoreProps) => {
  const styles = useStyles(getTeamsScoreStyles);

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

      {score !== undefined &&
        (isWinner ?
          <Typographies.VeryBig color={styles.teamNameContainer.color} verticalTrim>
            {score.toString()}
          </Typographies.VeryBig>
        : checkSingleNumber(score) ? <OutlinedNumber size="small">{score}</OutlinedNumber>
        : <Typographies.VeryBig color={styles.teamNameContainer.color} verticalTrim>
            {score.toString()}
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
