import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View } from 'react-native';

import { Player } from './components/player';
import { TeamScore } from './components/team-score';
import { Player as PlayerType } from './components/types/player';
import { useGameImageAssets } from '../home/hooks/use-game-image-assets';

import { Section } from '~/shared/components/section/section';
import { Typographies } from '~/shared/components/typographies';
import { useStyles } from '~/shared/hooks/use-styles';
import { useTheme } from '~/shared/hooks/use-theme';
import { useTranslate } from '~/shared/hooks/use-translate';
import { ModalLayout } from '~/shared/layouts/modal-layout';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface GameDetailsModalProps {
  players: PlayerType[];
}

export const GameDetailsModal = React.memo(({ players }: GameDetailsModalProps) => {
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
        <Section title="Joueurs">
          <View style={styles.playersContainer}>
            <View style={styles.playersTeamContainer}>
              <Player
                picture="https://medias.kametotv.fr/karmine/players/uploaded/TARGALEC.png"
                name="Targamas"
                role="top"
                position="left"
              />
              <Player
                picture="https://medias.kametotv.fr/karmine/players/uploaded/CABOLEC.png"
                name="Cabochard"
                role="top"
                position="left"
              />
              <Player
                picture="https://medias.kametotv.fr/karmine/players/uploaded/CABOLEC.png"
                name="Cabochard"
                role="top"
                position="left"
              />
            </View>
            <View style={styles.playersTeamContainer}>
              <Player
                picture="https://medias.kametotv.fr/karmine/players/uploaded/TARGALEC.png"
                name="Targamas"
                role="top"
                position="right"
              />
              <Player
                picture="https://medias.kametotv.fr/karmine/players/uploaded/CABOLEC.png"
                name="Cabochard"
                role="top"
                position="right"
              />
              <Player
                picture="https://medias.kametotv.fr/karmine/players/uploaded/CABOLEC.png"
                name="Cabochard"
                role="top"
                position="right"
              />
            </View>
          </View>
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
  },
  playersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  playersTeamContainer: {
    gap: 16,
  },
}));
