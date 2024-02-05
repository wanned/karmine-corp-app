import { View } from 'react-native';
import { Iconify } from 'react-native-iconify';

import { Buttons } from '~/shared/components/buttons';
import { Typographies } from '~/shared/components/typographies';
import { CoreData } from '~/shared/data/core/types';
import { useStyles } from '~/shared/hooks/use-styles';
import { useTheme } from '~/shared/hooks/use-theme';
import { useTranslate } from '~/shared/hooks/use-translate';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface RlGamesProps extends CoreData.RocketLeagueMatch {}

interface RlGameProps extends CoreData.RocketLeagueGame {
  number: number;
}

interface ScoreLineProps {
  leftTeamScore: number;
  rightTeamScore: number;
  label: string;
  showCrown?: boolean;
}

const ScoreLine = ({ leftTeamScore, rightTeamScore, label, showCrown = false }: ScoreLineProps) => {
  const styles = useStyles(getStyles);

  const theme = useTheme();

  const crown =
    showCrown ?
      <Iconify icon="solar:crown-bold" size={16} color={styles.crown.color} style={styles.crown} />
    : null;

  return (
    <View style={styles.scoreContainer}>
      <View style={styles.scoreCrownContainer}>
        <Typographies.Body>{leftTeamScore.toString()}</Typographies.Body>
        {leftTeamScore > rightTeamScore ? crown : null}
      </View>
      <Typographies.Body color={theme.colors.subtleForeground}>{label}</Typographies.Body>
      <View style={styles.scoreCrownContainer}>
        {rightTeamScore > leftTeamScore ? crown : null}
        <Typographies.Body>{rightTeamScore.toString()}</Typographies.Body>
      </View>
    </View>
  );
};

const RlGame = ({ number, teams }: RlGameProps) => {
  const styles = useStyles(getStyles);

  const translate = useTranslate();

  return (
    <View>
      <View style={styles.headerContainer}>
        <Typographies.Title2>
          {translate('gameDetails.gamePrefix')} {number.toString()}
        </Typographies.Title2>
      </View>
      <View style={styles.scoresContainer}>
        <ScoreLine
          leftTeamScore={teams.home.goals}
          rightTeamScore={teams.away.goals}
          label={translate('gameDetails.goalsText')}
          showCrown
        />
        <ScoreLine
          leftTeamScore={teams.home.stops}
          rightTeamScore={teams.away.stops}
          label={translate('gameDetails.stopsText')}
        />
        <ScoreLine
          leftTeamScore={teams.home.totalPoints}
          rightTeamScore={teams.away.totalPoints}
          label={translate('gameDetails.totalText')}
        />
      </View>
      <Buttons.Text text={translate('gameDetails.watchReplayText')} onPress={() => {}} />
    </View>
  );
};

export const RlGames = ({ matchDetails }: RlGamesProps) => {
  const styles = useStyles(getStyles);

  return (
    <View style={styles.gamesContainer}>
      {matchDetails.games.length > 0 &&
        matchDetails.games.map(
          (game, index) => game && <RlGame number={index + 1} key={index} {...game} />
        )}
    </View>
  );
};

const getStyles = createStylesheet((theme) => ({
  gamesContainer: {
    gap: 12,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scoresContainer: {
    paddingVertical: 8,
    gap: 4,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  scoreCrownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  crown: {
    position: 'relative',
    color: '#F9D370',
    top: -1.5,
  },
}));
