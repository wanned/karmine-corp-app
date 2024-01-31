import { useEffect, useMemo } from 'react';
import { View } from 'react-native';

import { DayList } from './components/day-list';
import { MatchesScrollLists } from './components/matches-scroll-lists';
import { useCalendarState } from './hooks/use-calendar-state';
import { groupMatchesByDay } from './utils/group-matches-by-day';

import { useMatchesResults } from '~/shared/hooks/data/use-matches-results';
import { useNextMatches } from '~/shared/hooks/data/use-next-matches';
import { useStyles } from '~/shared/hooks/use-styles';
import { DefaultLayout } from '~/shared/layouts/default-layout';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

export default function CalendarScreen() {
  const styles = useStyles(getStyles);

  const nextMatches = useNextMatches();
  const matchesResults = useMatchesResults();

  const matches = [...nextMatches.map((match) => match), ...matchesResults.map((match) => match)];

  const groupedMatches = useMemo(() => groupMatchesByDay(matches), [matches]);

  const setMatchesDates = useCalendarState(({ setMatchesDates }) => setMatchesDates);
  useEffect(() => {
    setMatchesDates(groupedMatches.map(([date]) => date));
  }, [groupedMatches, setMatchesDates]);

  return (
    <DefaultLayout>
      <View style={styles.dayListContainer}>
        <DayList />
      </View>

      <View style={styles.matchesListContainer}>
        <MatchesScrollLists groupedMatches={groupedMatches} />
      </View>
    </DefaultLayout>
  );
}

const getStyles = createStylesheet((theme) => ({
  dayListContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  matchesListContainer: {
    flex: 1,
  },
}));
