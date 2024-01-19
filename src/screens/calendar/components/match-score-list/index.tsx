import React, { useEffect, useRef } from 'react';
import { FlatList, View, useWindowDimensions } from 'react-native';

import { MatchList } from './match-list';
import { useSelectedDate } from '../../hooks/use-selected-date';
import { GroupedMatchesByDay } from '../../utils/group-matches-by-day';

import { isSameDay } from '~/shared/utils/is-same-day';

interface MatchsScrollListsProps {
  groupedMatches: GroupedMatchesByDay;
}

export const MatchsScrollLists = React.memo(({ groupedMatches }: MatchsScrollListsProps) => {
  const virtualizedListRef = useRef<FlatList<GroupedMatchesByDay[number]>>(null);
  const { width: screenWidth } = useWindowDimensions();

  const expectedSelectedDate = useRef<Date | null>(null);
  const selectedDate = useSelectedDate(({ selectedDate }) => selectedDate);

  useEffect(() => {
    const index = groupedMatches.findIndex(([day]) => isSameDay(day, selectedDate));
    if (
      index === -1 ||
      (expectedSelectedDate.current !== null &&
        isSameDay(expectedSelectedDate.current, selectedDate))
    )
      return;
    virtualizedListRef.current?.scrollToIndex({ index, animated: true });
  }, [groupedMatches, selectedDate]);

  const setSelectedDate = useSelectedDate(({ setSelectedDate }) => setSelectedDate);

  return (
    <FlatList<GroupedMatchesByDay[number]>
      style={{ width: screenWidth, position: 'relative', left: -16 }}
      ref={virtualizedListRef}
      decelerationRate="fast"
      onMomentumScrollEnd={(event) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
        const [date] = groupedMatches[index];
        expectedSelectedDate.current = date;
        setSelectedDate(date);
      }}
      pagingEnabled
      horizontal
      data={groupedMatches}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item: [date, matches] }) => {
        return (
          <View style={{ width: screenWidth, paddingHorizontal: 16 }}>
            <MatchList matches={matches} />
          </View>
        );
      }}
      getItemLayout={(_, index) => ({
        length: screenWidth,
        offset: screenWidth * index,
        index,
      })}
    />
  );
});
