import { DataFetcher } from '~/shared/data/core/data-fetcher';

export async function getAllPlayers({ apis }: Pick<DataFetcher.GetScheduleParams, 'apis'>) {
  const teams = await apis.lolEsport.getAllTeams();
  return teams.flatMap((team) => team.players);
}
