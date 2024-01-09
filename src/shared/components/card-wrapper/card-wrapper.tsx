import { useState, useRef, useCallback } from 'react';
import { View } from 'react-native';
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
}

export const CardWrapper = ({ cardData }: CardWrapperProps) => {
  const styles = getStyles(styleTokens);

  const [activePageIndex, setActivePageIndex] = useState(0);

  const realCurrentPageIndex = useRef(0);
  const realNextPageIndex = useRef(0);

  const onPageSelected = useCallback((event: PagerViewOnPageScrollEvent) => {
    console.log(event.nativeEvent.position, event.nativeEvent.offset);

    // When we scroll to the right, the position is incremented when the scroll is finished.
    // So if the offset is >= 0.5 and the position is the same as the last active page index, we increment the position.
    if (
      event.nativeEvent.offset >= 0.5 &&
      event.nativeEvent.position === realCurrentPageIndex.current
    ) {
      realNextPageIndex.current = realCurrentPageIndex.current + 1;
      setActivePageIndex(realNextPageIndex.current);
    }

    // When we scroll to the left, the position is decremented when the scroll is started.
    // So if the offset is >= 0.5 and the position is not the same as the last active page index, we decrement the position.
    if (
      event.nativeEvent.offset >= 0.5 &&
      event.nativeEvent.position !== realCurrentPageIndex.current
    ) {
      realNextPageIndex.current = realCurrentPageIndex.current - 1;
      setActivePageIndex(realNextPageIndex.current);
    }

    // If the offset is < 0.5, cancel the update.
    if (event.nativeEvent.offset < 0.5) {
      setActivePageIndex(realCurrentPageIndex.current);
      realNextPageIndex.current = realCurrentPageIndex.current;
    }

    // If the offset is 0, the scroll is finished. Update the current page index.
    if (
      event.nativeEvent.offset === 0 &&
      realNextPageIndex.current !== realCurrentPageIndex.current
    ) {
      realCurrentPageIndex.current = realNextPageIndex.current;
    }
  }, []);

  return (
    <View>
      <PagerView
        style={styles.viewPager}
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
    height: 171,
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
