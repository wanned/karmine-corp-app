import { Image } from 'expo-image';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Iconify } from 'react-native-iconify';

import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';
import { Buttons } from '~/shared/components/buttons';
import { Typographies } from '~/shared/components/typographies';
import { useReplay } from '~/shared/hooks/use-replay';
import { useStyles } from '~/shared/hooks/use-styles';
import { useTheme } from '~/shared/hooks/use-theme';
import { useTranslate } from '~/shared/hooks/use-translate';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface ValoGamesProps extends CoreData.ValorantMatch {}

interface ValoGameProps extends CoreData.ValorantGame {
  number: number;
  teams: CoreData.Match['teams'];
  date: Date;
  gameNumbers: number;
  competitionName: CoreData.CompetitionName;
}

const ValoGame = ({
  number,
  composition,
  score,
  teams,
  gameNumbers,
  competitionName,
  mapName,
  date,
}: ValoGameProps) => {
  const styles = useStyles(getStyles);

  const theme = useTheme();

  const translate = useTranslate();

  const { replayVideo, openReplayVideo, searchReplay } = useReplay();
  useEffect(() => {
    searchReplay({
      date,
      teams,
      game: competitionName,
      ...(gameNumbers > 1 ? { gameNumber: number } : {}),
    });
  }, [date, teams, competitionName, gameNumbers, searchReplay]);

  const crown = (
    <Iconify icon="solar:crown-bold" size={16} color={styles.crown.color} style={styles.crown} />
  );

  return (
    <View>
      <View style={styles.headerContainer}>
        <Typographies.Title2 verticalTrim>
          {translate('gameDetails.gamePrefix')} {number.toString()}
        </Typographies.Title2>
        <Typographies.Body color={theme.colors.subtleForeground} verticalTrim>
          {mapName}
        </Typographies.Body>
      </View>
      <View style={styles.scoresContainer}>
        <View style={StyleSheet.compose(styles.scoreContainer, styles.scoreContainerLeft)}>
          <View style={styles.championsContainer}>
            {composition.home.map((pick, index) => (
              <Image
                key={index}
                source={{ uri: pick.agent.imageUrl }}
                style={{ width: 24, height: 24 }}
              />
            ))}
          </View>
          <Typographies.Body>{score.home.toString()}</Typographies.Body>
          {score.home > score.away ? crown : null}
        </View>
        <View style={StyleSheet.compose(styles.scoreContainer, styles.scoreContainerRight)}>
          <View style={styles.championsContainer}>
            {composition.away.map((pick, index) => (
              <Image
                key={index}
                source={{ uri: pick.agent.imageUrl }}
                style={{ width: 24, height: 24 }}
              />
            ))}
          </View>
          <Typographies.Body>{score.away.toString()}</Typographies.Body>
          {score.away > score.home ? crown : null}
        </View>
      </View>
      {replayVideo !== undefined && (
        <Buttons.Text text={translate('gameDetails.watchReplayText')} onPress={openReplayVideo} />
      )}
    </View>
  );
};

export const ValoGames = ({ matchDetails, date, teams }: ValoGamesProps) => {
  const styles = useStyles(getStyles);
  return (
    <View style={styles.gamesContainer}>
      {matchDetails.games.length > 0 &&
        matchDetails.games.map((game, index) => (
          <ValoGame
            number={index + 1}
            key={index}
            {...game}
            teams={teams}
            competitionName={matchDetails.competitionName}
            date={new Date(date)}
            gameNumbers={matchDetails.games.length}
          />
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
    marginTop: 8,
    marginBottom: 12,
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
  crown: {
    position: 'relative',
    color: '#F9D370',
    top: -1.5,
  },
}));
