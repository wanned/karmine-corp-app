import { KarmineApi } from '~/shared/apis/karmine/types/KarmineApi';
import { Matchs } from '~/shared/types/data/Matchs';

const DEFAULT_KC_LOGO_URL = 'https:///medias.kametotv.fr/karmine/teams_logo/KC.png';
const DEFAULT_LOGO_URL = ''; // TODO: Add default logo url

export const parseMatchTeams = (event: KarmineApi.Events[number]): Matchs[number]['teams'] => {
  const teamNames = event.title
    .replace(/\[.*\]/g, '')
    .trim()
    .split(' vs ')
    .map((teamName) => teamName.trim());

  let teams: { name: string; logoUrl: string }[] = [];

  if (teamNames.length === 1) {
    teams = [
      {
        name: teamNames[0],
        logoUrl: teamNames[0].startsWith('KC ') ? DEFAULT_KC_LOGO_URL : DEFAULT_LOGO_URL,
      },
    ];
  } else if (teamNames.length === 2) {
    teams = [
      {
        name: teamNames[0],
        logoUrl: event.team_domicile,
      },
      {
        name: teamNames[1],
        logoUrl: event.team_exterieur,
      },
    ];
  } else {
    teams = teamNames.map((teamName) => ({
      name: teamName,
      logoUrl: DEFAULT_LOGO_URL,
    }));
  }

  return teams;
};
