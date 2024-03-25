import { Team } from './components/team';

import { useLeaderboards } from '~/lib/karmine-corp-api/adapters/react-native-hook/use-leaderboards';
import { useTeams } from '~/lib/karmine-corp-api/adapters/react-native-hook/use-teams';
import { DefaultLayout } from '~/shared/layouts/default-layout';

export default function TeamsScreen() {
  const { teams } = useTeams();
  const { leaderboards } = useLeaderboards();

  return (
    <DefaultLayout>
      {Object.entries(teams).map(([game, players]) => (
        <Team.Container title={game as keyof typeof teams} key={game}>
          {leaderboards[game as keyof typeof teams] && (
            <Team.Leaderboard
              leaderboard={leaderboards[game as keyof typeof teams]!.map((team) => ({
                ...team,
                isKarmine: team.teamName.toLowerCase().includes('karmine'),
              }))}
            />
          )}
          <Team.Players players={players} />
        </Team.Container>
      ))}
    </DefaultLayout>
  );
}
