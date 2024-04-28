import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useState } from 'react';
import { LogBox, View } from 'react-native';

import { LolGames } from './components/lol-games';
import { Player } from './components/player';
import { RlGames } from './components/rl-games';
import { TeamScore } from './components/team-score';
import { ValoGames } from './components/valo-games';
import { useGameBackgroundImage } from '../home/hooks/use-game-background-image';

import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';
import { Buttons } from '~/shared/components/buttons';
import { MatchLabel } from '~/shared/components/match-preview/components/match-label';
import { Section } from '~/shared/components/section/section';
import { Typographies } from '~/shared/components/typographies';
import { useReplay } from '~/shared/hooks/use-replay';
import { useStyles } from '~/shared/hooks/use-styles';
import { useTheme } from '~/shared/hooks/use-theme';
import { useTranslate } from '~/shared/hooks/use-translate';
import { ModalLayout } from '~/shared/layouts/modal-layout';
import { ModalsParamList } from '~/shared/navigation';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface GameDetailsModalProps
  extends NativeStackScreenProps<ModalsParamList, 'gameDetailsModal'> {}

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

export const GameDetailsModal = React.memo(
  ({
    route: {
      params: { match },
    },
  }: GameDetailsModalProps) => {
    const translate = useTranslate();
    const styles = useStyles(getStyles);

    const [isNotified, setIsNotified] = useState(false);

    const gameDetails = GameDetails({ match });
    const gamePlayers = GameDetailsPlayers({ match });

    return (
      <ModalLayout scrollViewStyle={{ marginTop: -130, zIndex: -1 }} opacifyOnScroll>
        <GameDetailsHeader
          game={match.matchDetails.competitionName}
          teamHome={match.teams[0]}
          teamAway={match.teams[1]}
        />
        <View style={styles.gameInfosContainer}>
          <MatchLabel
            date={match.date}
            competitionName={match.matchDetails.competitionName}
            status={match.status}
            bo={match.matchDetails.bo}
          />
          <GameButtons match={match} isNotified={isNotified} setIsNotified={setIsNotified} />
        </View>
        <View style={styles.gameDetailsContainer}>
          {gameDetails === null && gamePlayers === null ?
            <View style={styles.noGameDetails}>
              <Typographies.Body>{translate('gameDetails.noGameDetails')}</Typographies.Body>
            </View>
          : <>
              {gameDetails}
              {gamePlayers}
            </>
          }
        </View>
      </ModalLayout>
    );
  }
);

function GameDetailsHeader({
  game,
  teamHome,
  teamAway,
}: {
  game: CoreData.Match['matchDetails']['competitionName'];
  teamHome: CoreData.Match['teams'][0];
  teamAway: CoreData.Match['teams'][1];
}) {
  const styles = useStyles(getStyles);

  const gameImageAssets = useGameBackgroundImage();
  const gameImage = gameImageAssets?.[game];

  const theme = useTheme();
  const gradientColor = theme.colors.background;

  return (
    <View style={styles.headerContainer}>
      {gameImage && (
        <Image
          style={styles.headerImage}
          source={{ uri: gameImage.uri }}
          cachePolicy="memory-disk"
        />
      )}
      <LinearGradient
        style={styles.headerImageGradient}
        colors={[`${gradientColor}00`, `${gradientColor}33`, `${gradientColor}FF`]}
        locations={[0, 0.9, 1]}
      />
      <LinearGradient
        style={styles.headerImageGradient}
        colors={[
          `${gradientColor}B5`,
          `${gradientColor}EA`,
          `${gradientColor}FA`,
          `${gradientColor}FF`,
        ]}
        locations={[0, 0.5, 0.6, 1]}
      />
      <View style={styles.headerScoreContainer}>
        <TeamScore
          logo={teamHome.logoUrl}
          score={teamHome.score?.score ?? '-'}
          name={teamHome.name}
          position="left"
          isWinner={teamHome.score?.isWinner}
        />
        {teamAway && (
          <TeamScore
            logo={teamAway.logoUrl}
            score={teamAway.score?.score ?? '-'}
            name={teamAway.name}
            position="right"
            isWinner={teamAway.score?.isWinner}
          />
        )}
      </View>
    </View>
  );
}

const GameButtons = ({
  match,
  isNotified,
  setIsNotified,
}: {
  match: CoreData.Match;
  isNotified: boolean;
  setIsNotified: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const buttons: React.ReactElement[] = [];

  if (match.status === 'upcoming') {
    buttons.push(
      <GameDetailsNotificationButton
        match={match}
        isNotified={isNotified}
        setIsNotified={setIsNotified}
      />
    );
  }

  if (match.status === 'live') {
    buttons.push(<GameDetailsStreamButton match={match} />);
  }
  if (match.status === 'finished') {
    buttons.push(<GameDetailsReplayButton match={match} />);
  }

  return buttons;
};

function GameDetailsNotificationButton({
  match,
  isNotified,
  setIsNotified,
}: {
  match: CoreData.Match;
  isNotified: boolean;
  setIsNotified: (isNotified: boolean) => void;
}) {
  const styles = useStyles(getStyles);
  const translate = useTranslate();

  if (match.status !== 'upcoming') {
    return null;
  }

  return (
    <View style={styles.buttonsContainer}>
      {!isNotified ?
        <Buttons.Primary
          text={translate('gameDetails.beNotifiedButtonText')}
          onPress={() => setIsNotified(true)}
        />
      : <Buttons.Secondary
          text={translate('gameDetails.cancelNotificationButtonText')}
          onPress={() => setIsNotified(false)}
        />
      }
    </View>
  );
}

function GameDetailsStreamButton({ match }: { match: CoreData.Match }) {
  const styles = useStyles(getStyles);
  const translate = useTranslate();

  if (!match.streamLink) {
    return null;
  }

  return (
    <View style={styles.buttonsContainer}>
      <Buttons.Primary text={translate('gameDetails.watchStreamButtonText')} onPress={() => {}} />
      <Buttons.Secondary text={translate('gameDetails.shareStreamButtonText')} onPress={() => {}} />
    </View>
  );
}

function GameDetailsReplayButton({ match }: { match: CoreData.Match }) {
  const styles = useStyles(getStyles);
  const translate = useTranslate();

  const { replayVideo, openReplayVideo, searchReplay } = useReplay();
  useEffect(() => {
    searchReplay({
      date: new Date(match.date),
      teams: match.teams,
      game: match.matchDetails.competitionName,
    });
  }, [match, searchReplay]);

  if (
    match.matchDetails.competitionName === CoreData.CompetitionName.LeagueOfLegendsLFL ||
    match.matchDetails.competitionName === CoreData.CompetitionName.LeagueOfLegendsLEC
  ) {
    return null;
  }

  if (replayVideo === undefined) {
    return null;
  }

  return (
    <View style={styles.buttonsContainer}>
      <Buttons.Primary text={translate('gameDetails.watchReplayText')} onPress={openReplayVideo} />
    </View>
  );
}

function GameDetails({ match }: { match: CoreData.Match }) {
  const translate = useTranslate();

  const GameDetailsComponent = useMemo(() => {
    switch (match.matchDetails.competitionName) {
      case CoreData.CompetitionName.LeagueOfLegendsLFL:
      case CoreData.CompetitionName.LeagueOfLegendsLEC: {
        return <LolGames {...(match as CoreData.LeagueOfLegendsMatch)} />;
      }
      case CoreData.CompetitionName.RocketLeague: {
        return <RlGames {...(match as CoreData.RocketLeagueMatch)} />;
      }
      case CoreData.CompetitionName.ValorantVCT:
      case CoreData.CompetitionName.ValorantVCTGC: {
        return <ValoGames {...(match as CoreData.ValorantMatch)} />;
      }
      default: {
        return null;
      }
    }
  }, [match]);

  if (!GameDetailsComponent) {
    return null;
  }

  if ('games' in match.matchDetails && match.matchDetails.games.length === 0) {
    return null;
  }

  return <Section title={translate('gameDetails.gamesTitle')}>{GameDetailsComponent}</Section>;
}

function GameDetailsPlayers({ match }: { match: CoreData.Match }) {
  const translate = useTranslate();
  const styles = useStyles(getStyles);

  const homePlayers = match.matchDetails.players?.home ?? [];
  const awayPlayers = match.matchDetails.players?.away ?? [];

  if (homePlayers.length === 0 && awayPlayers.length === 0) {
    return null;
  }

  return (
    <Section title={translate('gameDetails.playersTitle')}>
      <View style={styles.playersContainer}>
        <View style={styles.playersTeamContainer}>
          {homePlayers.map((player) => (
            <Player key={player.name} position="left" player={player} />
          ))}
        </View>
        <View style={styles.playersTeamContainer}>
          {awayPlayers.map((player) => (
            <Player key={player.name} position="right" player={player} />
          ))}
        </View>
      </View>
    </Section>
  );
}

const getStyles = createStylesheet((theme) => {
  const HEADER_HEIGHT = 216;
  const HEADER_MARGIN_BOTTOM = 48;

  return {
    buttonsContainer: {
      gap: 12,
    },
    headerContainer: {
      height: HEADER_HEIGHT + HEADER_MARGIN_BOTTOM,
    },
    headerImage: {
      position: 'absolute',
      width: '100%',
      height: '100%',
    },
    headerImageGradient: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: '100%',
    },
    headerScoreContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-end',
      gap: 40,
      marginBottom: 60, // This value is magic ^^'
      top: 64 - HEADER_MARGIN_BOTTOM,
    },
    gameInfosContainer: {
      paddingHorizontal: 16,
      gap: 16,
    },
    gameDetailsContainer: {
      flex: 1,
      paddingHorizontal: 16,
      gap: 16,
      marginTop: 32,
    },
    playersContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    playersTeamContainer: {
      gap: 16,
    },
    noGameDetails: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      opacity: theme.opacities.priority2,
      position: 'relative',
      top: -70,
    },
    titleDate: {
      color: theme.colors.accent,
    },
  };
});
