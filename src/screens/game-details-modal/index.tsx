import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { LogBox, View } from 'react-native';

import { Game } from './components/game';
import { Player } from './components/player';
import { TeamScore } from './components/team-score';
import { useGameImageAssets } from '../home/hooks/use-game-image-assets';

import { Section } from '~/shared/components/section/section';
import { useStyles } from '~/shared/hooks/use-styles';
import { useTheme } from '~/shared/hooks/use-theme';
import { useTranslate } from '~/shared/hooks/use-translate';
import { ModalLayout } from '~/shared/layouts/modal-layout';
import { RootStackParamList } from '~/shared/navigation';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface GameDetailsModalProps
  extends NativeStackScreenProps<RootStackParamList, 'gameDetailsModal'> {}

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

export const GameDetailsModal = React.memo(({ route: { params } }: GameDetailsModalProps) => {
  const theme = useTheme();

  const gradientColor = theme.colors.background;

  const styles = useStyles(getStyles);

  const translate = useTranslate();

  const gameImageAssets = useGameImageAssets();

  return (
    <ModalLayout>
      <View style={styles.headerContainer}>
        <Image
          style={styles.headerImage}
          source={gameImageAssets?.lol || { uri: '' }}
          cachePolicy="memory-disk"
        />
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
            logo="https://medias.kametotv.fr/karmine/teams_logo/KC.png"
            score={1}
            name="Karmine Corp"
            position="left"
          />
          <TeamScore
            logo="https://medias.kametotv.fr/karmine/teams_logo/KC.png"
            score={3}
            name="Karmine Corp"
            position="right"
            isWinner
          />
        </View>
      </View>
      <View style={styles.gameDetailsContainer}>
        {params.match.teams[0].players.length > 0 ? (
          <Section title="Joueurs">
            <View style={styles.playersContainer}>
              <View style={styles.playersTeamContainer}>
                {params.match.teams[0].players.map((player) => (
                  <Player
                    key={player.name}
                    picture={player.picture}
                    name={player.name}
                    role={player.role}
                    position={player.position}
                  />
                ))}
              </View>
              <View style={styles.playersTeamContainer}>
                {params.match.teams[1].players.map((player) => (
                  <Player
                    key={player.name}
                    picture={player.picture}
                    name={player.name}
                    role={player.role}
                    position={player.position}
                  />
                ))}
              </View>
            </View>
          </Section>
        ) : null}
        <Section title="Games">
          <params.gamesComponent match={params.match} />
        </Section>
      </View>
    </ModalLayout>
  );
});

const getStyles = createStylesheet((theme) => ({
  headerContainer: {
    height: 280,
    marginTop: -130,
    zIndex: -1,
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
    marginBottom: 60,
  },
  gameDetailsContainer: {
    paddingHorizontal: 16,
    gap: 48,
  },
  playersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  playersTeamContainer: {
    gap: 16,
  },
}));
