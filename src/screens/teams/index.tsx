import { StyleSheet } from 'react-native';

import { LeaderBoard } from './components/Leaderboard';
import Player from './components/Player';
import Team from './components/Team';

import { useTranslate } from '~/shared/hooks/use-translate';
import { DefaultLayout } from '~/shared/layouts/default-layout';

export default function TeamsScreen() {
  return (
    <DefaultLayout>
      <LeaderBoard.Container title="League Of Legends LEC">
        <LeaderBoard.Teams>
          <Team logo="" name="Fnatic" top={1} score={100} wins={13} looses={3} />
          <Team logo="" name="Karmine Corp" top={2} score={100} wins={13} looses={3} isWinner />
          <Team logo="" name="G2" top={3} wins={13} looses={3} score={100} />
        </LeaderBoard.Teams>
        <LeaderBoard.Players
          players={[
            {
              picture: 'https://medias.kametotv.fr/karmine/players/uploaded/CABOLEC.png',
              name: 'Player 1',
              isStreaming: true,
            },
            {
              picture: 'https://medias.kametotv.fr/karmine/players/uploaded/Atowvfv2.png',
              name: 'Player 2',
            },
            {
              picture: 'https://medias.kametotv.fr/karmine/players/uploaded/SAKENLEC.png',
              name: 'Player 3',
              isStreaming: true,
            },
            {
              picture: 'https://medias.kametotv.fr/karmine/players/uploaded/TARGALEC.png',
              name: 'Player 4',
            },
            {
              picture: 'https://medias.kametotv.fr/karmine/players/uploaded/TARGALEC.png',
              name: 'Player 5',
            },
          ]}
        />
      </LeaderBoard.Container>
    </DefaultLayout>
  );
}

const styles = StyleSheet.create({});
