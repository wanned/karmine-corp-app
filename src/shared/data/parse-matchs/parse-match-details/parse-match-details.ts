import { parseLeagueOfLegendsMatchDetails } from './parse-lol-match-details';

import { KarmineApi } from '~/shared/apis/karmine/types/KarmineApi';
import { MatchDetails } from '~/shared/types/data/Matchs';

export const parseMatchDetails = async (
  event: KarmineApi.Events[number]
): Promise<MatchDetails> => {
  const competitionName = event.competition_name;

  try {
    switch (competitionName) {
      case KarmineApi.CompetitionName.LeagueOfLegendsLEC:
      case KarmineApi.CompetitionName.LeagueOfLegendsLFL: {
        const matchDetails = await parseLeagueOfLegendsMatchDetails({
          ...event,
          competition_name: competitionName,
        });

        if (matchDetails !== null) {
          return matchDetails;
        }
      }
    }
  } catch {}

  return Promise.resolve({
    game: event.competition_name,
  });
};
