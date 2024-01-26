import { LeaderBoard } from './components/Leaderboard';

import { DefaultLayout } from '~/shared/layouts/default-layout';

export default function TeamsScreen() {
  return (
    <DefaultLayout>
      <LeaderBoard.Container title="League Of Legends LEC">
        <LeaderBoard.Teams
          teams={[
            { logo: '', name: 'Fnatic', top: 1, wins: 13, looses: 3 },
            { logo: '', name: 'Karmine Corp', top: 2, wins: 13, looses: 3, isKarmine: true },
            { logo: '', name: 'G2', top: 3, wins: 13, looses: 3 },
            { logo: '', name: 'Rogue', top: 4, wins: 13, looses: 3 },
          ]}
        />
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
