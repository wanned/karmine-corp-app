import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';
import { OutlinedNumber } from '~/shared/components/card/card-content/outlined-numbers';
import { checkSingleNumber } from '~/shared/components/card/utils/check-single-number';
import { Typographies } from '~/shared/components/typographies';
import { useStyles } from '~/shared/hooks/use-styles';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface TeamProps {
  logo: string;
  name: string;
  score: CoreData.Score | undefined;
  isWinner?: boolean;
}

interface TeamScoreProps extends TeamProps {
  position: 'left' | 'right';
}

export const TeamScore = ({ logo, name, score, isWinner, position }: TeamScoreProps) => {
  const styles = useStyles(getStyles);

  return (
    <View
      style={StyleSheet.compose(
        styles.teamContainer,
        position === 'left' ? styles.teamContainerLeft : styles.teamContainerRight
      )}>
      <View style={styles.teamNameContainer}>
        <Image source={{ uri: logo }} cachePolicy="memory-disk" style={{ width: 70, height: 70 }} />
        <Typographies.Title3 color={styles.teamNameContainer.color}>
          {name.replaceAll(' & ', '\n')}
        </Typographies.Title3>
      </View>

      {score === undefined ?
        <Typographies.Huge color={styles.teamNameContainer.color} verticalTrim>
          -
        </Typographies.Huge>
      : score.scoreType === 'top' ?
        <Typographies.VeryBig color={styles.teamNameContainer.color} verticalTrim>
          Top {score.score.toString()}
        </Typographies.VeryBig>
      : isWinner || !checkSingleNumber(score.score) ?
        <Typographies.Huge color={styles.teamNameContainer.color} verticalTrim>
          {score.score.toString()}
        </Typographies.Huge>
      : <OutlinedNumber size="large">{score.score}</OutlinedNumber>}
    </View>
  );
};

const getStyles = createStylesheet((theme) => ({
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
