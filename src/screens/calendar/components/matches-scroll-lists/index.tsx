import React, { useEffect, useRef, useCallback } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  useWindowDimensions,
} from 'react-native';

import { MatchesList } from './matches-page';
import { useSelectedDate } from '../../hooks/use-selected-date';
import { GroupedMatchesByDay } from '../../utils/group-matches-by-day';

import { isSameDay } from '~/shared/utils/is-same-day';

interface MatchesScrollListsProps {
  groupedMatches: GroupedMatchesByDay;
}

export const MatchesScrollLists = React.memo(({ groupedMatches }: MatchesScrollListsProps) => {
  const flatListRef = useRef<FlatList<GroupedMatchesByDay[number]>>(null);
  const flatListFocused = useRef(false);
  const lastContentOffset = useRef<number | null>(null);

  const { width: screenWidth } = useWindowDimensions();

  const expectedSelectedDate = useRef<Date | null>(null);
  const selectedDate = useSelectedDate(({ selectedDate }) => selectedDate);
  const setSelectedDate = useSelectedDate(({ setSelectedDate }) => setSelectedDate);

  useEffect(() => {
    const index = groupedMatches.findIndex(([day]) => isSameDay(day, selectedDate));

    if (
      index === -1 ||
      (expectedSelectedDate.current !== null &&
        isSameDay(expectedSelectedDate.current, selectedDate))
    )
      return;

    lastContentOffset.current = null;
    expectedSelectedDate.current = null;

    flatListRef.current?.scrollToIndex({ index, animated: true });
  }, [groupedMatches, selectedDate]);

  const onScrollBeginDrag = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    lastContentOffset.current = event.nativeEvent.contentOffset.x;
    flatListFocused.current = true;
  }, []);

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (lastContentOffset.current === null) return;

      const currentContentOffset = event.nativeEvent.contentOffset.x;
      const diff = Math.abs(lastContentOffset.current - currentContentOffset);

      if (diff < screenWidth / 2) return;

      const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);

      const [date] = groupedMatches[index];

      expectedSelectedDate.current = date;

      if (flatListFocused.current) return;

      setSelectedDate(expectedSelectedDate.current);
    },
    [groupedMatches, screenWidth, setSelectedDate]
  );

  const onScrollEndDrag = useCallback(() => {
    flatListFocused.current = false;

    if (expectedSelectedDate.current === null) return;

    setSelectedDate(expectedSelectedDate.current);
  }, [setSelectedDate]);

  return (
    <FlatList<GroupedMatchesByDay[number]>
      style={{ width: screenWidth, position: 'relative', left: -16 }}
      ref={flatListRef}
      decelerationRate="fast"
      onScrollBeginDrag={onScrollBeginDrag}
      onScroll={onScroll}
      onScrollEndDrag={onScrollEndDrag}
      pagingEnabled
      horizontal
      data={groupedMatches}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item: [, matches] }) => <MatchesList matches={matches} />}
      getItemLayout={(_, index) => ({
        length: screenWidth,
        offset: screenWidth * index,
        index,
      })}
    />
  );
});
