import { View } from 'react-native';

import { DayList } from './components/day-list';
import { MatchesScrollLists } from './components/matches-scroll-lists';
import { useInitCalendar } from './hooks/use-calendar';

import { useMatches } from '~/shared/hooks/data/use-matches';
import { useStyles } from '~/shared/hooks/use-styles';
import { DefaultLayout } from '~/shared/layouts/default-layout';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

export default function CalendarScreen() {
  const styles = useStyles(getStyles);

  const groupedMatches = useMatches();
  useInitCalendar(groupedMatches.matches);

  return (
    <DefaultLayout>
      <View style={styles.dayListContainer}>
        <DayList />
      </View>

      <View style={styles.matchesListContainer}>
        <MatchesScrollLists />
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
