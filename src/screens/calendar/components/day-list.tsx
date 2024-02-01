import { useAtomValue } from 'jotai';
import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { FlatList, StyleSheet, useWindowDimensions } from 'react-native';

import { DayButton, dayButtonConstants } from './day-button';
import { daysAtom, selectedIndexWithNoMatchAtom } from '../hooks/use-calendar';

import { useGroupedMatches } from '~/shared/hooks/data/use-matches';
import { useStyles } from '~/shared/hooks/use-styles';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

export const DayList = React.memo(() => {
  const dayListRef = useRef<FlatList<(typeof days)[number]>>(null);

  const { width } = useWindowDimensions();

  const styles = useStyles(getStyles);

  const groupedMatches = useGroupedMatches();

  const selectedIndex = useAtomValue(selectedIndexWithNoMatchAtom);
  const days = useAtomValue(daysAtom);

  const firstScroll = useRef(true);
  const scrollInitialized = useRef(false);

  useEffect(() => {
    scrollInitialized.current = false;
  }, [groupedMatches]);

  const scrollToSelectedIndex = useCallback(() => {
    if (selectedIndex === null) return;

    dayListRef.current?.scrollToIndex({
      index: selectedIndex,
      animated: scrollInitialized.current,
      viewPosition: 0.5,
      viewOffset: !firstScroll.current ? 0 : width / 2,
    });

    firstScroll.current = false;
  }, [selectedIndex, width]);

  useLayoutEffect(() => {
    scrollToSelectedIndex();
    scrollInitialized.current = true;
  }, [selectedIndex]);

  const layoutInitialised = useRef(false);

  return (
    <FlatList<(typeof days)[number]>
      data={days}
      renderItem={_DayButton}
      keyExtractor={(day) => day}
      ref={dayListRef}
      style={StyleSheet.compose(styles.dayListContainer, { width })}
      onLayout={() => {
        if (layoutInitialised.current) return;
        layoutInitialised.current = true;
        scrollToSelectedIndex();
      }}
      horizontal
      showsHorizontalScrollIndicator={false}
      getItemLayout={(_, index) => {
        const itemSpace =
          dayButtonConstants.width + dayButtonConstants.padding * 2 + dayButtonConstants.margin * 2;
        return {
          length: itemSpace,
          offset: itemSpace * index,
          index,
        };
      }}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
    />
  );
});

function _DayButton({ item: day }: { item: string }) {
  return <DayButton day={day} />;
}

const getStyles = createStylesheet((theme) => ({
  dayListContainer: {
    marginBottom: 16,
    position: 'relative',
    left: -16,
  },
}));
