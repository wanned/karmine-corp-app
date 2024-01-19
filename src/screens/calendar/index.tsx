import { useEffect, useMemo } from 'react';
import { View } from 'react-native';

import { DayList } from './components/day-list';
import { MatchsScrollLists } from './components/match-score-list';
import { useSelectedDate } from './hooks/use-selected-date';
import { groupMatchesByDay } from './utils/group-matches-by-day';

import { useMatchesResults } from '~/shared/hooks/data/use-matches-results';
import { useNextMatches } from '~/shared/hooks/data/use-next-matches';
import { useStyles } from '~/shared/hooks/use-styles';
import { DefaultLayout } from '~/shared/layouts/default-layout';
import { createStylesheet } from '~/shared/styles/create-stylesheet';
import { IsoDate } from '~/shared/types/IsoDate';

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

  return (
    <DefaultLayout>
      <View style={styles.dayListContainer}>
        <DayList />
      </View>

      <MatchsScrollLists groupedMatches={groupedMatches} />
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
