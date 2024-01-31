import React from 'react';

import { MatchScore } from '~/shared/components/match/match-score';
import { MatchTeam } from '~/shared/components/match/match-team';
import { Section } from '~/shared/components/section/section';
import { useNextMatches } from '~/shared/hooks/data/use-next-matches';
import { useTranslate } from '~/shared/hooks/use-translate';

interface NextMatchesProps {
  viewMoreButton?: React.ReactNode;
  max?: number;
}

export const NextMatches = ({ viewMoreButton, max }: NextMatchesProps) => {
  const translate = useTranslate();

  const matchs = useNextMatches();

  if (!matchs?.length) {
    return null;
  }

  return (
    <Section title={translate('home.nextMatchesTitle')}>
      {matchs.slice(0, max).map((match) => (
        <MatchScore
          key={match.id}
          date={match.date}
          status="upcoming"
          bo={'bo' in match.matchDetails ? match.matchDetails.bo : undefined}
          game={match.matchDetails.competitionName}>
          {match.teams.map(
            (team, index) =>
              team && <MatchTeam key={index} logo={team.logoUrl} name={team.name} score="-" />
          )}
        </MatchScore>
      ))}
      {viewMoreButton}
    </Section>
  );
};
