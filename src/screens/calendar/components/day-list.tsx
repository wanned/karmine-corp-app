import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { StyleSheet, VirtualizedList, useWindowDimensions } from 'react-native';

import { DayButton, dayButtonConstants } from './day-button';
import { useSelectedDate } from '../hooks/use-selected-date';

import { useStyles } from '~/shared/hooks/use-styles';
import { createStylesheet } from '~/shared/styles/create-stylesheet';
import { IsoDate } from '~/shared/types/IsoDate';
import { isSameDay } from '~/shared/utils/is-same-day';

export const DayList = React.memo(() => {
  const dayListRef = useRef<VirtualizedList<IsoDate>>(null);

  const { width } = useWindowDimensions();

  const styles = useStyles(getStyles);

  const allIsoDays = useSelectedDate(({ allIsoDays }) => allIsoDays);
  const selectedDate = useSelectedDate(({ selectedDate }) => selectedDate);

  const selectedIndex = useMemo(() => {
    if (allIsoDays.length === 0) return -1;

    return allIsoDays.findIndex((isoDay) => isSameDay(new Date(isoDay), selectedDate));
  }, [allIsoDays, selectedDate]);

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
    <VirtualizedList<IsoDate>
      ref={dayListRef}
      style={StyleSheet.compose(styles.dayListContainer, { width })}
      horizontal
      data={allIsoDays}
      getItem={(data, index) => data[index]}
      getItemCount={(data) => data.length}
      keyExtractor={(isoDay) => isoDay}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item: isoDay }) => <DayButton isoDay={isoDay} />}
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
