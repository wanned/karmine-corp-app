import { View } from 'react-native';
import { KarmineApi } from '~/shared/apis/karmine/types/KarmineApi';

import { Typographies } from '~/shared/components/typographies';
import { useStyles } from '~/shared/hooks/use-styles';
import { useTheme } from '~/shared/hooks/use-theme';
import { createStylesheet } from '~/shared/styles/create-stylesheet';
import {
  LeagueOfLegendsGame,
  LeagueOfLegendsMatchDetails,
  Match,
} from '~/shared/types/data/Matchs';

interface LolGamesProps {
  match: Match & {
    matchDetails: LeagueOfLegendsMatchDetails;
  };
}

interface LolGameProps extends LeagueOfLegendsGame {
  number: number;
}

const LolGame = ({ number, draft, duration, score }: LolGameProps) => {
  const styles = useStyles(getStyles);

  const theme = useTheme();

  return (
    <View>
      <View style={styles.headerContainer}>
        <Typographies.Title2>Match {number.toString()}</Typographies.Title2>
        <Typographies.Title2 color={theme.colors.subtleForeground}>{duration}</Typographies.Title2>
      </View>
      <View>
        <View>
          {/* champions */}
          <Typographies.Title2>{score.red.toString()}</Typographies.Title2>
        </View>
      </View>
      {/* <Typographies.Title2>Score: {score.toString()}</Typographies.Title2> */}
      {/* <Typographies.Title2>Draft: {JSON.stringify(draft)}</Typographies.Title2> */}
    </View>
  );
};

export const LolGames = ({ match: { matchDetails } }: LolGamesProps) => {
  return (
    <View>
      {matchDetails.games.length > 0 &&
        matchDetails.games.map((game, index) => (
          <LolGame number={index + 1} key={index} {...game} />
        ))}
    </View>
  );
};

const getStyles = createStylesheet((theme) => ({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
}));
