import { Team } from './components/team';

import { useTeams } from '~/shared/hooks/data/use-teams';
import { DefaultLayout } from '~/shared/layouts/default-layout';

export default function TeamsScreen() {
  const { data: teams } = useTeams();

  return (
    <DefaultLayout>
      {teams === undefined ? null : (
        Object.entries(teams).map(([game, team]) => (
          <Team.Container title={game as keyof typeof teams} key={game}>
            {team.leaderboard && (
              <Team.Leaderboard
                leaderboard={team.leaderboard.map((team) => ({
                  ...team,
                  isKarmine: team.name.toLowerCase().includes('karmine'),
                }))}
              />
            )}
            <Team.Players players={team.players} />
          </Team.Container>
        ))
      )}
    </DefaultLayout>
  );
}
