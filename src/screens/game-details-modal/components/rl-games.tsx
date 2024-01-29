import { View } from 'react-native';

import { Buttons } from '~/shared/components/buttons';
import { Typographies } from '~/shared/components/typographies';
import { useStyles } from '~/shared/hooks/use-styles';
import { useTheme } from '~/shared/hooks/use-theme';
import { useTranslate } from '~/shared/hooks/use-translate';
import { createStylesheet } from '~/shared/styles/create-stylesheet';
import {
  LeagueOfLegendsGame,
  LeagueOfLegendsMatchDetails,
  Match,
} from '~/shared/types/data/Matchs';

interface RlGamesProps {
  match: Match & {
    matchDetails: LeagueOfLegendsMatchDetails;
  };
}

interface RlGameProps extends LeagueOfLegendsGame {
  number: number;
}

interface ScoreLineProps {
  leftTeamScore: number;
  rightTeamScore: number;
  label: string;
}

const ScoreLine = ({ leftTeamScore, rightTeamScore, label }: ScoreLineProps) => {
  const styles = useStyles(getStyles);

  const theme = useTheme();

  return (
    <View style={styles.scoreContainer}>
      <View style={styles.scoreCrownContainer}>
        <Typographies.Body>{leftTeamScore.toString()}</Typographies.Body>
      </View>
      <Typographies.Body color={theme.colors.subtleForeground}>{label}</Typographies.Body>
      <View style={styles.scoreCrownContainer}>
        <Typographies.Body>{rightTeamScore.toString()}</Typographies.Body>
      </View>
    </View>
  );
};

const RlGame = ({ number }: RlGameProps) => {
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
          leftTeamScore={23}
          rightTeamScore={10}
          label={translate('gameDetails.goalsText')}
        />
        <ScoreLine
          leftTeamScore={10}
          rightTeamScore={3}
          label={translate('gameDetails.stopsText')}
        />
        <ScoreLine
          leftTeamScore={10023}
          rightTeamScore={321}
          label={translate('gameDetails.totalText')}
        />
      </View>
      <Buttons.Text text={translate('gameDetails.watchReplayText')} onPress={() => {}} />
    </View>
  );
};

export const RlGames = ({ match: { matchDetails } }: RlGamesProps) => {
  const styles = useStyles(getStyles);

  return (
    <View style={styles.gamesContainer}>
      {matchDetails.games.length > 0 &&
        matchDetails.games.map((game, index) => (
          <RlGame number={index + 1} key={index} {...game} />
        ))}
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
}));
