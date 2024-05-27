import { useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import PagerView from 'react-native-pager-view';

import { Card } from '../card/card';

import { useStyles } from '~/shared/hooks/use-styles';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface CardWrapperProps {
  cardsData: (
    | {
        id: string;
        content: React.ReactNode;
        image: { uri: string };
        onPress?: () => void;
      }
    | undefined
  )[];
  height: number;
}

export const CardWrapper = ({ cardsData, height }: CardWrapperProps) => {
  const styles = useStyles(getStyles);
  const { width } = useWindowDimensions();

  const definedCardsData = cardsData.filter(
    (card): card is NonNullable<typeof card> => card !== undefined
  );

  const [activePageIndex, setActivePageIndex] = useState(0);

  if (definedCardsData.length === 0) return null;

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
        {definedCardsData.map((card) => (
          <View style={{ marginHorizontal: 16 }} key={card.id}>
            <Card image={card.image} onPress={card.onPress}>
              {card.content}
            </Card>
          </View>
        ))}
      </PagerView>
      {definedCardsData.length > 1 && (
        <View style={styles.dots}>
          {definedCardsData.map((_, index) => (
            <View style={[styles.dot, activePageIndex === index && styles.activeDot]} key={index} />
          ))}
        </View>
      )}
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
