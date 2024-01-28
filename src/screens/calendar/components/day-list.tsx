import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { StyleSheet, VirtualizedList, useWindowDimensions } from 'react-native';

import { DayButton, dayButtonConstants } from './day-button';
import { useCalendarState } from '../hooks/use-calendar-state';

import { useStyles } from '~/shared/hooks/use-styles';
import { createStylesheet } from '~/shared/styles/create-stylesheet';
import { isSameDay } from '~/shared/utils/is-same-day';

export const DayList = React.memo(() => {
  const dayListRef = useRef<VirtualizedList<(typeof dates)[number]>>(null);

  const { width } = useWindowDimensions();

  const styles = useStyles(getStyles);

  const dates = useCalendarState(({ dates }) => dates);
  const selectedDate = useCalendarState(({ selectedDate }) => selectedDate);

  const selectedIndex = useMemo(() => {
    if (dates.length === 0) return -1;

    return dates.findIndex(({ date }) => isSameDay(date, selectedDate));
  }, [dates, selectedDate]);

  const scrollInitialized = useRef(false);
  useLayoutEffect(() => {
    if (selectedIndex === -1) return;

    dayListRef.current?.scrollToIndex({
      index: selectedIndex,
      animated: scrollInitialized.current,
      viewPosition: 0.5,
      viewOffset: scrollInitialized.current ? 0 : width / 2,
    });

    scrollInitialized.current = true;
  }, [selectedIndex]);

  return (
    <VirtualizedList<(typeof dates)[number]>
      ref={dayListRef}
      style={StyleSheet.compose(styles.dayListContainer, { width })}
      horizontal
      data={dates}
      getItem={(data, index) => data[index]}
      getItemCount={(data) => data.length}
      keyExtractor={({ date }) => date.toISOString()}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item: date }) => <DayButton date={date} />}
      getItemLayout={(_, index) => {
        const itemSpace =
          dayButtonConstants.width + dayButtonConstants.padding * 2 + dayButtonConstants.margin * 2;
        return {
          length: itemSpace,
          offset: itemSpace * index,
          index,
        };
      }}
    />
  );
});

const getStyles = createStylesheet((theme) => ({
  dayListContainer: {
    marginBottom: 16,
    position: 'relative',
    left: -16,
  },
}));
