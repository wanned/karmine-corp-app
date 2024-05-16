import { Effect } from 'effect';
import { PartialDeep } from 'type-fest';

import { mainLayer } from './utils/main-layer';
import { CoreData } from '../../application/types/core-data';
import { MatchesRepository } from '../../infrastructure/repositories/matches/matches-repository';

function mergeMatchData(
  match: CoreData.Match,
  newData: PartialDeep<CoreData.Match>
): CoreData.Match {
  return {
    id: newData.id || match.id,
    date: newData.date || match.date,
    status: newData.status || match.status,
    teams: match.teams.map((team) => {
      // The teams should be the same, so we don't care if we loop over the new data or the old data
      if (team === null) {
        return team;
      }
      const newTeam = newData.teams?.find((t) => t !== null && t.name === team.name);
      if (!newTeam) {
        return team;
      }
      return {
        name: newTeam.name || team.name,
        logoUrl: newTeam.logoUrl || team.logoUrl,
        score: newTeam.score || team.score,
      };
    }) as CoreData.Match['teams'],
    streamLink: newData.streamLink || match.streamLink,
    matchDetails: {
      ...match.matchDetails,
      ...newData.matchDetails,
      competitionName: newData.matchDetails?.competitionName || match.matchDetails.competitionName,
      bo: newData.matchDetails?.bo || match.matchDetails.bo,
      players:
        (
          newData.matchDetails?.players &&
          (newData.matchDetails.players.home || newData.matchDetails.players.away)
        ) ?
          {
            home: newData.matchDetails.players.home || (match.matchDetails.players?.home ?? []),
            away: newData.matchDetails.players.away || (match.matchDetails.players?.away ?? []),
          }
        : match.matchDetails.players,
    },
  };
}

export const upsertMatchInDatabase = (match: CoreData.Match, { destroy = false } = {}) =>
  Effect.runPromise(
    Effect.provide(
      Effect.flatMap(MatchesRepository.getMatch({ id: match.id }), (savedMatch) =>
        MatchesRepository.upsertMatches([
          {
            id: match.id,
            data:
              destroy ?
                JSON.stringify(match)
              : JSON.stringify(mergeMatchData(JSON.parse(savedMatch?.data || '{}'), match)),
            timestamp: new Date(match.date).getTime(),
          },
        ])
      ),
      mainLayer
    )
  ).catch((error) => {
    console.error(error);
  });
