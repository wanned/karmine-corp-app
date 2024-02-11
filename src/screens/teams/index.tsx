import { Team } from './components/team';

import { useLeaderboards } from '~/shared/hooks/data/use-leaderboards';
import { usePlayers } from '~/shared/hooks/data/use-players';
import { DefaultLayout } from '~/shared/layouts/default-layout';

export default function TeamsScreen() {
  const { data: groupedPlayers } = usePlayers();
  const leaderboards = useLeaderboards();

  return (
    <DefaultLayout>
      {groupedPlayers === undefined ? null : (
        Object.entries(groupedPlayers).map(([game, players]) => (
          <Team.Container title={game as keyof typeof groupedPlayers} key={game}>
            {leaderboards[game as keyof typeof groupedPlayers] && (
              <Team.Leaderboard
                leaderboard={leaderboards[game as keyof typeof groupedPlayers]!.map((team) => ({
                  ...team,
                  isKarmine: team.teamName.toLowerCase().includes('karmine'),
                }))}
              />
            )}
            <Team.Players players={players} />
          </Team.Container>
        ))
      )}
    </DefaultLayout>
  );
}
