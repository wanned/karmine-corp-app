import { MatchScore } from '~/shared/components/match/match-score';
import { MatchTeam } from '~/shared/components/match/match-team';
import { Section } from '~/shared/components/section/section';
import { useMatchesResults } from '~/shared/hooks/data/use-matches-results';
import { useTranslate } from '~/shared/hooks/use-translate';

interface LastResultsProps {
  viewMoreButton?: React.ReactNode;
  max?: number;
}

export const LastResults = ({ viewMoreButton, max }: LastResultsProps) => {
  const translate = useTranslate();

  const matchs = useMatchesResults();

  if (!matchs?.length) {
    return null;
  }

  return (
    <Section title={translate('home.lastResultsTitle')}>
      {matchs.slice(0, max).map((match) => (
        <MatchScore
          key={match.id}
          date={match.date}
          status="upcoming"
          bo={'bo' in match.matchDetails ? match.matchDetails.bo : undefined}
          game={match.matchDetails.competitionName}>
          {match.teams.map(
            (team, index) =>
              team && (
                <MatchTeam
                  key={index}
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
              )
          )}
        </MatchScore>
      ))}
      {viewMoreButton}
    </Section>
  );
};
