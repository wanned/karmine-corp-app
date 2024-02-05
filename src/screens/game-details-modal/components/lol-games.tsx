import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { Buttons } from '~/shared/components/buttons';
import { Typographies } from '~/shared/components/typographies';
import { CoreData } from '~/shared/data/core/types';
import { useStyles } from '~/shared/hooks/use-styles';
import { useTheme } from '~/shared/hooks/use-theme';
import { useTranslate } from '~/shared/hooks/use-translate';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface LolGamesProps extends CoreData.LeagueOfLegendsMatch {}

interface LolGameProps extends CoreData.LeagueOfLegendsGame {
  number: number;
}

const LolGame = ({ number, draft, duration, score }: LolGameProps) => {
  const styles = useStyles(getStyles);

  const theme = useTheme();

  const translate = useTranslate();

  function formatMatchDuration(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const paddedMinutes = minutes.toString().padStart(2, '0');
    const paddedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${paddedMinutes}:${paddedSeconds}`;
  }

  return (
    <View>
      <View style={styles.headerContainer}>
        <Typographies.Title2 verticalTrim>
          {translate('gameDetails.gamePrefix')} {number.toString()}
        </Typographies.Title2>
        {duration !== undefined && (
          <Typographies.Body color={theme.colors.subtleForeground} verticalTrim>
            {formatMatchDuration(duration)}
          </Typographies.Body>
        )}
      </View>
      <View style={styles.scoresContainer}>
        <View style={StyleSheet.compose(styles.scoreContainer, styles.scoreContainerLeft)}>
          <View style={styles.championsContainer}>
            {draft.home.picks.map((pick, index) => (
              <Image
                key={index}
                source={{ uri: pick.champion.imageUrl }}
                style={{ width: 24, height: 24 }}
              />
            ))}
          </View>
          <Typographies.Body>{score.home.toString()}</Typographies.Body>
        </View>
        <View style={StyleSheet.compose(styles.scoreContainer, styles.scoreContainerRight)}>
          <View style={styles.championsContainer}>
            {draft.away.picks.map((pick, index) => (
              <Image
                key={index}
                source={{ uri: pick.champion.imageUrl }}
                style={{ width: 24, height: 24 }}
              />
            ))}
          </View>
          <Typographies.Body>{score.away.toString()}</Typographies.Body>
        </View>
      </View>
      <Buttons.Text text={translate('gameDetails.watchReplayText')} onPress={() => {}} />
    </View>
  );
};

export const LolGames = ({ matchDetails }: LolGamesProps) => {
  const styles = useStyles(getStyles);

  return (
    <View style={styles.gamesContainer}>
      {matchDetails.games.length > 0 &&
        matchDetails.games.map((game, index) => (
          <LolGame number={index + 1} key={index} {...game} />
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
    marginBottom: 6,
  },
  championsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  scoreContainer: {
    alignItems: 'center',
    gap: 12,
  },
  scoreContainerLeft: {
    flexDirection: 'row',
  },
  scoreContainerRight: {
    flexDirection: 'row-reverse',
  },
}));
