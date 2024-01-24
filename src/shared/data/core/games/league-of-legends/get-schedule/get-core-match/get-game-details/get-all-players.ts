import { lolEsportApiClient } from '~/shared/data/external-apis/league-of-legends/lol-esport-api-client';

export async function getAllPlayers() {
  const teams = await lolEsportApiClient.getAllTeams();
  return teams.flatMap((team) => team.players);
}
