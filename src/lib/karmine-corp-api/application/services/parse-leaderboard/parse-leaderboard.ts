import { Data, Effect } from 'effect';

import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';

interface BracketMatch {
  id: string;
  teams: {
    id: string;
    name: string;
    image: string;
    result?: { outcome: 'win' | 'loss' | null } | null;
    origin: { type: 'match' | string; structuralId: string };
  }[];
  structuralId: string;
}

interface BracketColumn {
  cells: { matches: BracketMatch[] }[];
}

interface GroupRanking {
  ordinal: number;
  teams: {
    id: string;
    name: string;
    image: string;
    record: { wins: number; losses: number };
  }[];
}

export interface HomogeneousStanding {
  stages: {
    sections: (
      | {
          type: 'bracket';
          columns: BracketColumn[];
        }
      | {
          type: 'group';
          rankings: GroupRanking[];
        }
      | {
          type: 'crossGroup';
          rankings: GroupRanking[];
        }
    )[];
  }[];
}

export type Leaderboard = Record<string, CoreData.LeaderboardItem>;

function updateLeaderboard(
  leaderboard: Leaderboard,
  team: { name: string; id: string; image: string },
  position: number,
  resultOrRecord: 'win' | 'loss' | { wins: number; looses: number }
) {
  if (team.id === '0' || team.name.toLowerCase() === 'tbd') {
    return;
  }

  if (!(team.id in leaderboard)) {
    leaderboard[team.id] = {
      position,
      wins: 0,
      looses: 0,
      teamId: team.id,
      teamName: team.name,
      logoUrl: team.image,
    };
  }

  if (resultOrRecord === 'win') {
    leaderboard[team.id].wins = (leaderboard[team.id].wins ?? 0) + 1;
  } else if (resultOrRecord === 'loss') {
    leaderboard[team.id].looses = (leaderboard[team.id].looses ?? 0) + 1;
  } else {
    leaderboard[team.id].wins = (leaderboard[team.id].wins ?? 0) + resultOrRecord.wins;
    leaderboard[team.id].looses = (leaderboard[team.id].looses ?? 0) + resultOrRecord.looses;
  }
}

function mergeLeaderboards(...leaderboards: Leaderboard[]) {
  const masterLeaderboard: Leaderboard = {};

  for (const leaderboard of leaderboards) {
    for (const teamId in leaderboard) {
      const team = leaderboard[teamId];
      updateLeaderboard(
        masterLeaderboard,
        {
          id: team.teamId,
          name: team.teamName,
          image: team.logoUrl,
        },
        leaderboard[teamId].position,
        {
          wins: leaderboard[teamId].wins ?? 0,
          looses: leaderboard[teamId].looses ?? 0,
        }
      );
    }
  }

  return masterLeaderboard;
}

function getNextMatches(match_: BracketMatch, columns: BracketColumn[]) {
  const nextMatches: BracketMatch[] = [];

  for (const column of [...columns].reverse()) {
    for (const cell of column.cells) {
      for (const match of cell.matches) {
        if (
          match.teams.some(
            (team) =>
              team.origin.type === 'match' && team.origin.structuralId === match_.structuralId
          )
        ) {
          nextMatches.push(match);
        }
      }
    }
  }

  return nextMatches;
}

function getMatchTree(match_: BracketMatch, columns: BracketColumn[]) {
  for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
    const column = columns[columnIndex];
    for (const cell of column.cells) {
      for (const match of cell.matches) {
        if (match.id === match_.id) {
          return { column, columnIndex, cell, match };
        }
      }
    }
  }

  throw new Error('Match not found');
}

function getEliminatedTeamsInCell(cell: BracketColumn['cells'][number], columns: BracketColumn[]) {
  let eliminatedTeamsInCell = 0;
  for (const match of cell.matches) {
    const nextMatches = getNextMatches(match, columns);
    eliminatedTeamsInCell += match.teams.length - nextMatches.length;
  }
  return eliminatedTeamsInCell;
}

function getMatchTop(match: BracketMatch, columns: BracketColumn[]): number {
  const nextMatches = getNextMatches(match, columns);

  const { cell } = getMatchTree(match, columns);
  const eliminatedTeamsInCell = getEliminatedTeamsInCell(cell, columns);

  if (nextMatches.length === 0) {
    return eliminatedTeamsInCell;
  }

  return Math.max(
    ...nextMatches.map((nextMatch) => getMatchTop(nextMatch, columns) + eliminatedTeamsInCell)
  );
}

function parseBracket(columns: BracketColumn[]): Leaderboard {
  const leaderboard: Leaderboard = {};

  for (const column of [...columns].reverse()) {
    for (const cell of column.cells) {
      for (const match of cell.matches) {
        const nextMatches = getNextMatches(match, columns);
        const isFinal = nextMatches.length === 0;

        const matchTop = getMatchTop(match, columns);
        const positionIfWin = matchTop - (isFinal ? 1 : 0);
        const positionIfloss = matchTop;

        for (const team of match.teams) {
          if (team.result?.outcome === 'win') {
            updateLeaderboard(leaderboard, team, positionIfWin, 'win');
          } else {
            updateLeaderboard(leaderboard, team, positionIfloss, 'loss');
          }
        }
      }
    }
  }

  return leaderboard;
}

function parseGroup(rankings: GroupRanking[]): Leaderboard {
  return Object.fromEntries(
    rankings
      .map((ranking) =>
        ranking.teams.map(
          (team) =>
            [
              team.id,
              {
                teamId: team.id,
                teamName: team.name,
                logoUrl: team.image,
                position: ranking.ordinal,
                wins: team.record.wins,
                looses: team.record.losses,
              },
            ] as const
        )
      )
      .flat()
  );
}

class UnsupportedMultipleSections extends Data.TaggedError('UnsupportedMultipleSections') {}
class KarmineNotInLeaderboard extends Data.TaggedError('KarmineNotInLeaderboard') {}

export function parseLeaderboard(
  standings: HomogeneousStanding[]
): Effect.Effect<Leaderboard, UnsupportedMultipleSections | KarmineNotInLeaderboard, never> {
  return Effect.firstSuccessOf(
    [...standings].reverse().map((standing, i) =>
      Effect.gen(function* (_) {
        let leaderboard: Leaderboard = {};

        const stages = standing.stages;

        for (const stage of [...stages].reverse()) {
          const section = yield* _(findRelevantSection(stage));

          if (!section) {
            continue;
          }

          if (section.type === 'bracket') {
            leaderboard = mergeLeaderboards(leaderboard, parseBracket(section.columns));
          }

          if (section.type === 'group') {
            leaderboard = mergeLeaderboards(leaderboard, parseGroup(section.rankings));
          }

          if (section.type === 'crossGroup') {
            leaderboard = mergeLeaderboards(leaderboard, parseGroup(section.rankings));
          }
        }

        return yield* _(validateLeaderboard(leaderboard));
      })
    )
  );
}

function findRelevantSection(
  stage: HomogeneousStanding['stages'][number]
): Effect.Effect<
  HomogeneousStanding['stages'][number]['sections'][number] | undefined,
  UnsupportedMultipleSections,
  never
> {
  return Effect.gen(function* (_) {
    const sections = stage.sections;

    const isAllSectionsAreGroups = sections.every(
      (section) => section.type === 'group' || section.type === 'crossGroup'
    );

    if (isAllSectionsAreGroups) {
      type GroupSection = Extract<(typeof sections)[number], { type: 'group' | 'crossGroup' }>;
      return (sections as GroupSection[]).find((section) =>
        section.rankings.some((ranking) =>
          ranking.teams.some((team) => team.name.toLowerCase().includes('karmine'))
        )
      );
    } else if (sections.length > 1) {
      return yield* _(Effect.fail(new UnsupportedMultipleSections()));
    } else {
      return sections[0];
    }
  });
}

function validateLeaderboard(
  leaderboard: Leaderboard
): Effect.Effect<Leaderboard, KarmineNotInLeaderboard, never> {
  return Effect.gen(function* (_) {
    if (
      !Object.values(leaderboard).some((team) => team.teamName.toLowerCase().includes('karmine'))
    ) {
      return yield* _(Effect.fail(new KarmineNotInLeaderboard()));
    }

    return leaderboard;
  });
}
