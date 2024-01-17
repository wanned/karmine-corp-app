import { useEffect, useMemo } from 'react';
import { View } from 'react-native';

import { DayList } from './components/day-list';
import { useSelectedDate } from './hooks/use-selected-date';
import { groupMatchesByDay } from './utils/group-matches-by-day';

import { MatchScore } from '~/shared/components/match/match-score';
import { MatchTeam } from '~/shared/components/match/match-team';
import { useMatchesResults } from '~/shared/hooks/data/use-matches-results';
import { useNextMatches } from '~/shared/hooks/data/use-next-matches';
import { useStyles } from '~/shared/hooks/use-styles';
import { DefaultLayout } from '~/shared/layouts/default-layout';
import { createStylesheet } from '~/shared/styles/create-stylesheet';
import { IsoDate } from '~/shared/types/IsoDate';
import { isSameDay } from '~/shared/utils/is-same-day';

export default function CalendarScreen() {
  const styles = useStyles(getStyles);

  const nextMatches = useNextMatches();
  const matchesResults = useMatchesResults();

  const matches = [...nextMatches.map((match) => match), ...matchesResults.map((match) => match)];

  const groupedMatches = useMemo(() => groupMatchesByDay(matches), [matches]);
  const isoDays = useMemo(
    () => groupedMatches.map(([day]) => new Date(day).toISOString() as IsoDate),
    [groupedMatches]
  );

  const setAllMatchesDates = useSelectedDate(({ setAllMatchesDates }) => setAllMatchesDates);
  useEffect(() => {
    setAllMatchesDates(isoDays);
  }, [isoDays, setAllMatchesDates]);

  const selectedDate = useSelectedDate(({ selectedDate }) => selectedDate);
  const selectedIsoDay = useMemo(() => selectedDate.toISOString() as IsoDate, [selectedDate]);
  const matchesForSelectedDay = useMemo(
    () => groupedMatches.find(([day]) => isSameDay(new Date(selectedIsoDay), day))?.[1] ?? [],
    [groupedMatches, selectedIsoDay]
  );

  return (
    <DefaultLayout>
      <View style={styles.dayListContainer}>
        <DayList />
      </View>

      <View style={styles.matchesList}>
        {matchesForSelectedDay.length > 0 &&
          matchesForSelectedDay.map(
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
    </DefaultLayout>
  );
}

const getStyles = createStylesheet((theme) => ({
  dayListContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  matchesList: {
    gap: 16,
  },
}));
