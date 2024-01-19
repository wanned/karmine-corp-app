import React from 'react';
import { View, useWindowDimensions } from 'react-native';

import { MatchScore } from '~/shared/components/match/match-score';
import { MatchTeam } from '~/shared/components/match/match-team';
import { Match } from '~/shared/types/data/Matchs';

interface MatchesListProps {
  matches: Match[];
}

export const MatchesList = React.memo(
  ({ matches }: MatchesListProps) => {
    const { width: screenWidth } = useWindowDimensions();

    return (
      <View style={{ width: screenWidth, paddingHorizontal: 16 }}>
        {matches.map(
          (match, matchIndex) =>
            match && (
              <MatchScore
                // key={match.id}
                key={matchIndex} // FIXME: We may not use index as key. match.id seems to exist but it not typed.
                date={match.date}
                status="upcoming"
                bo={'bo' in match.matchDetails ? match.matchDetails.bo : undefined}
                game={match.matchDetails.game}>
                {match.teams.map((team, index) => (
                  <MatchTeam
                    // key={`${match.id}-${team.name}-${index}`}
                    key={`${matchIndex}-${team.name}-${index}`} // FIXME: We may not use index as key. match.id seems to exist but it not typed.
                    logo={team.logoUrl}
                    name={team.name}
                    isWinner={team.score?.isWinner}
                    score={
                      team.score === undefined
                        ? '-'
                        : team.score.scoreType === 'top'
                          ? `TOP ${team.score.score}`
                          : team.score.score
                    }
                  />
                ))}
              </MatchScore>
            )
        )}
      </View>
    );
  },
  (prevProps, nextProps) =>
    prevProps.matches.flatMap((match) => match.teams.map((team) => team.name)).join() ===
    nextProps.matches.flatMap((match) => match.teams.map((team) => team.name)).join()
);
