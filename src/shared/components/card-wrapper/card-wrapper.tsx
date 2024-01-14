import { useState, useRef, useCallback } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import PagerView, { PagerViewOnPageScrollEvent } from 'react-native-pager-view';

import { Card } from '../card/card';

import { useStyles } from '~/shared/hooks/use-styles';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface CardWrapperProps {
  cardData: {
    id: string;
    content: React.ReactNode;
    imagePath: string;
  }[];
  height: number;
}

export const CardWrapper = ({ cardData, height }: CardWrapperProps) => {
  const styles = useStyles(getStyles);
  const { width } = useWindowDimensions();

  const [activePageIndex, setActivePageIndex] = useState(0);

  return (
    <View>
      <PagerView
        style={StyleSheet.compose(styles.viewPager, {
          height,
          width,
        })}
        initialPage={0}
        onPageSelected={({ nativeEvent: { position } }) => {
          setActivePageIndex(position);
        }}>
        {cardData.map((card) => (
          <View style={{ marginHorizontal: 16 }} key={card.id}>
            <Card imagePath={card.imagePath}>{card.content}</Card>
          </View>
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
    position: 'relative',
    left: -16,
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
