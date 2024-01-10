import React from 'react';

import { MatchScore } from '~/shared/components/match/match-score';
import { MatchTeam } from '~/shared/components/match/match-team';
import { Section } from '~/shared/components/section/section';
import { useMatchs } from '~/shared/hooks/data/use-matchs';
import { useTranslate } from '~/shared/hooks/use-translate';

interface NextMatchesProps {
  viewMoreButton?: React.ReactNode;
  max?: number;
}

export const NextMatches = ({ viewMoreButton, max }: NextMatchesProps) => {
  const translate = useTranslate();

  const matchs = useMatchs();

  if (!matchs.length) {
    return null;
  }

  return (
    <Section title={translate('home.nextMatchesTitle')}>
      {matchs.slice(0, max).map(
        ({ data: match }, index) =>
          match && (
            <MatchScore
              key={index}
              date={match.date}
              status="upcoming"
              bo={'bo' in match.matchDetails ? match.matchDetails.bo : undefined}
              game={match.matchDetails.game}>
              {match.teams.map((team, index) => (
                <MatchTeam
                  key={index}
                  logo={team.logoUrl}
                  name={team.name}
                  isWinner={false /* TODO: compute this */}
                  score={'-' /* TODO: compute this */}
                />
              ))}
            </MatchScore>
          )
      )}
      {viewMoreButton}
    </Section>
  );
};
