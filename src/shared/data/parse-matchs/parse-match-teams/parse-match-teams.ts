import { KarmineApi } from '~/shared/apis/karmine/types/KarmineApi';
import { Matchs } from '~/shared/types/data/Matchs';
import { toCapitalCase } from '~/shared/utils/to-capital-case';

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
    const kcPlayerPrefix = 'KC ';
    const playerName = toCapitalCase(
      teamNames[0].startsWith(kcPlayerPrefix)
        ? teamNames[0].slice(kcPlayerPrefix.length)
        : teamNames[0]
    );

    teams = [
      {
        name: playerName,
        logoUrl: teamNames[0].startsWith('KC ') ? DEFAULT_KC_LOGO_URL : DEFAULT_LOGO_URL,
      },
    ];
  } else if (teamNames.length === 2) {
    teams = [
      {
        name: getTeamName(event.team_domicile) ?? teamNames[0],
        logoUrl: event.team_domicile,
      },
      {
        name: getTeamName(event.team_exterieur) ?? teamNames[1],
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

const getTeamName = (team: KarmineApi.Events[number]['team_domicile']) => {
  const regex = /https:\/\/medias\.kametotv\.fr\/karmine\/teams\/(.+?)-.+\..+/;

  const match = team.match(regex)?.[1];

  if (match === null || match === undefined) {
    return null;
  }

  return match === 'KC' || match === 'Karmine Corp' ? 'Karmine Corp' : match;
};
