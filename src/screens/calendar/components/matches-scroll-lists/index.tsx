import { useAtomValue, useSetAtom } from 'jotai';
import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  useWindowDimensions,
} from 'react-native';

import { MatchesList } from './matches-page';
import {
  matchDaysAtom,
  selectedDateAtom,
  selectedIndexOnlyWithMatchAtom,
} from '../../hooks/use-calendar';
import { getComparableDay } from '../../utils/get-comparable-day';

import { CoreData } from '~/shared/data/core/types';

export const MatchesScrollLists = React.memo(() => {
  const flatListRef = useRef<FlatList<(typeof matchDays)[string]>>(null);
  const flatListIsFocused = useRef(false);

  const { width: screenWidth } = useWindowDimensions();

  const selectDate = useSetAtom(selectedDateAtom);
  const selectedIndex = useAtomValue(selectedIndexOnlyWithMatchAtom);
  const matchDays = useAtomValue(matchDaysAtom);

  const expectedSelectedIndex = useRef<number | null>(null);

  const scrollToSelectedIndex = useCallback(
    (animated = true) => {
      if (selectedIndex === null) return;
      if (flatListIsFocused.current && selectedIndex === expectedSelectedIndex.current) return;

      flatListRef.current?.scrollToIndex({
        index: selectedIndex,
        animated,
      });

      flatListIsFocused.current = false;
    },
    [selectedIndex]
  );

  useEffect(() => scrollToSelectedIndex(true), [selectedIndex]);
  useEffect(() => scrollToSelectedIndex(false), [matchDays]);

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const newIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);

      expectedSelectedIndex.current = newIndex;

      if (!flatListIsFocused.current) return;

      const newDate = Object.keys(matchDays).sort()[newIndex];
      if (newDate === undefined) return;
      selectDate(getComparableDay(new Date(newDate)));
    },
    [selectDate, matchDays, screenWidth]
  );

  const onScrollBeginDrag = useCallback(() => (flatListIsFocused.current = true), []);
  const onScrollEndDrag = useCallback(() => {
    if (expectedSelectedIndex.current === null) return;

    const newDate = Object.keys(matchDays).sort()[expectedSelectedIndex.current];
    if (newDate === undefined) return;
    selectDate(getComparableDay(new Date(newDate)));
  }, []);

  const data = useMemo(
    () => Object.values(matchDays).sort((a, b) => a[0].date.getTime() - b[0].date.getTime()),
    [matchDays]
  );

  return (
    <FlatList<(typeof matchDays)[string]>
      data={data}
      renderItem={_MatchesList}
      keyExtractor={(matches) => matches[0].id}
      ref={flatListRef}
      style={{ width: screenWidth, position: 'relative', left: -16 }}
      getItemLayout={(_, index) => ({
        length: screenWidth,
        offset: screenWidth * index,
        index,
      })}
      pagingEnabled
      decelerationRate="fast"
      horizontal
      showsHorizontalScrollIndicator={false}
      onScroll={onScroll}
      onScrollBeginDrag={onScrollBeginDrag}
      onScrollEndDrag={onScrollEndDrag}
      initialNumToRender={1}
      initialScrollIndex={selectedIndex}
      maxToRenderPerBatch={3}
      windowSize={3}
    />
  );
});

function _MatchesList({ item: matches }: { item: CoreData.Match[] }) {
  return <MatchesList matches={matches} />;
}
