import { KarmineApi } from '~/shared/apis/karmine/types/KarmineApi';
import { Matchs } from '~/shared/types/data/Matchs';
import { toCapitalCase } from '~/shared/utils/to-capital-case';

const DEFAULT_KC_LOGO_URL = 'https:///medias.kametotv.fr/karmine/teams_logo/KC.png';
const DEFAULT_LOGO_URL = ''; // TODO: Add default logo url

type Event = {
  [K in keyof KarmineApi.Events[number] & keyof KarmineApi.EventsResults[number]]:
    | KarmineApi.Events[number][K]
    | KarmineApi.EventsResults[number][K];
} & {
  score_domicile?: string | undefined;
  score_exterieur?: string | undefined;
};

export const parseMatchTeams = (event: Event): Matchs[number]['teams'] => {
  const teamNames = parseTeamNamesFromTitle(event.title);

  let teams: Matchs[number]['teams'] = [];

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
        score: getTeamScore(event, 'domicile'),
      },
    ];
  } else if (teamNames.length === 2) {
    teams = [
      {
        name: getTeamName(event.team_domicile) ?? teamNames[0],
        logoUrl: event.team_domicile,
        score: getTeamScore(event, 'domicile'),
      },
      {
        name: getTeamName(event.team_exterieur) ?? teamNames[1],
        logoUrl: event.team_exterieur,
        score: getTeamScore(event, 'exterieur'),
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

export const parseTeamNamesFromTitle = (title: string): string[] => {
  const teamNames = title
    .replace(/\[.*\]/g, '')
    .trim()
    .split(' vs ')
    .map((teamName) => teamName.trim());

  return teamNames;
};

const getTeamScore = (
  event: Event,
  team: 'domicile' | 'exterieur'
): Matchs[number]['teams'][number]['score'] => {
  const scoreDomicile = event.score_domicile;
  const scoreExterieur = event.score_exterieur;

  if (scoreDomicile === undefined || scoreExterieur === undefined) {
    return undefined;
  }

  if (scoreDomicile === 'WIN') {
    if (team === 'domicile') {
      return {
        score: 1,
        isWinner: true,
      };
    } else {
      return {
        score: 0,
        isWinner: false,
      };
    }
  } else if (scoreDomicile === 'LOSE') {
    if (team === 'domicile') {
      return {
        score: 0,
        isWinner: false,
      };
    } else {
      return {
        score: 1,
        isWinner: true,
      };
    }
  }

  const score = team === 'domicile' ? scoreDomicile : scoreExterieur;

  if (score.startsWith('TOP')) {
    return {
      score: parseInt(score.slice(3).trim(), 10),
      scoreType: 'top',
    };
  }

  const parsedScore = parseInt(score, 10);
  const otherScore = team === 'domicile' ? scoreExterieur : scoreDomicile;
  const parsedOtherScore = parseInt(otherScore, 10);

  return {
    score: parseInt(score, 10),
    isWinner: parsedScore > parsedOtherScore,
  };
};
