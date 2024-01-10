import { useState, useRef, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import PagerView, { PagerViewOnPageScrollEvent } from 'react-native-pager-view';

import { Card } from '../card/card';

import { createStylesheet } from '~/shared/styles/create-stylesheet';
import { styleTokens } from '~/shared/styles/tokens';

interface CardWrapperProps {
  cardData: {
    id: string;
    content: React.ReactNode;
    imagePath: string;
  }[];
  height: number;
}

export const CardWrapper = ({ cardData, height }: CardWrapperProps) => {
  const styles = getStyles(styleTokens);

  const [activePageIndex, setActivePageIndex] = useState(0);

  const realCurrentPageIndex = useRef(0);
  const realNextPageIndex = useRef(0);
  const lastPositionRecorded = useRef<number | null>(null);
  const lastOffsetRecorded = useRef<number | null>(null);

  const onPageSelected = useCallback((event: PagerViewOnPageScrollEvent) => {
    // If the offset is 0 and the next page index is not the same as the current page index, it means that the user has scrolled to the next page.
    // So the current page index becomes the next page index.
    if (
      lastPositionRecorded.current !== null &&
      lastOffsetRecorded.current !== null &&
      ((lastPositionRecorded.current < event.nativeEvent.position &&
        event.nativeEvent.offset < lastOffsetRecorded.current) ||
        (lastPositionRecorded.current > event.nativeEvent.position &&
          event.nativeEvent.offset > lastOffsetRecorded.current))
    ) {
      realCurrentPageIndex.current = realNextPageIndex.current;
      lastPositionRecorded.current = null;
      lastOffsetRecorded.current = null;
      return;
    }

    // If the offset is < 0.5 and we scroll to the right, or if the offset is > 0.5 and we scroll to the left,
    // it means that the user has canceled the scroll and the next page index becomes the current page index.
    if (
      (event.nativeEvent.offset < 0.5 &&
        realNextPageIndex.current > realCurrentPageIndex.current) ||
      (event.nativeEvent.offset > 0.5 && realNextPageIndex.current < realCurrentPageIndex.current)
    ) {
      setActivePageIndex(realCurrentPageIndex.current);
      realNextPageIndex.current = realCurrentPageIndex.current;
    }

    // When we scroll to the right, the position is incremented when the scroll is finished.
    // So if the offset is >= 0.5 and the position is the current page index, we increment the next page index and set the active page index.
    if (
      event.nativeEvent.offset >= 0.5 &&
      event.nativeEvent.position === realCurrentPageIndex.current
    ) {
      realNextPageIndex.current = realCurrentPageIndex.current + 1;
      setActivePageIndex(realNextPageIndex.current);
    }

    // When we scroll to the left, the position is decremented when the scroll is started.
    // So if the offset is >= 0.5 and the position is not the current page index, we decrement the next page index and set the active page index.
    if (
      event.nativeEvent.offset <= 0.5 &&
      event.nativeEvent.position !== realCurrentPageIndex.current
    ) {
      realNextPageIndex.current = realCurrentPageIndex.current - 1;
      setActivePageIndex(realNextPageIndex.current);
    }

    lastPositionRecorded.current = event.nativeEvent.position;
    lastOffsetRecorded.current = event.nativeEvent.offset;
  }, []);

  return (
    <View>
      <PagerView
        style={StyleSheet.compose(styles.viewPager, { height })}
        initialPage={0}
        pageMargin={16}
        onPageScroll={onPageSelected}>
        {cardData.map((card) => (
          <Card imagePath={card.imagePath} key={card.id}>
            {card.content}
          </Card>
        ))}
      </PagerView>
      <View style={styles.dots}>
        {cardData?.map((_, index) => (
          <View style={[styles.dot, activePageIndex === index && styles.activeDot]} key={index} />
        ))}
      </View>
    </View>
  );
};

const getStyles = createStylesheet((theme) => ({
  viewPager: {
    flex: 1,
  },
  dots: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 3,
    marginTop: 12,
    backgroundColor: theme.colors.subtleForeground2,
  },
  activeDot: {
    backgroundColor: theme.colors.foreground,
  },
}));
