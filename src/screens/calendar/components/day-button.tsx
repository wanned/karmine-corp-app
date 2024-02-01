import { useAtom, useAtomValue } from 'jotai';
import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { matchDaysAtom, selectedDateAtom } from '../hooks/use-calendar';
import { getComparableDay } from '../utils/get-comparable-day';

import { Typographies } from '~/shared/components/typographies';
import { useDate } from '~/shared/hooks/use-date';
import { useStyles } from '~/shared/hooks/use-styles';
import { createStylesheet } from '~/shared/styles/create-stylesheet';
import { isSameDay } from '~/shared/utils/is-same-day';

interface DayButtonProps {
  day: string;
}

export const DayButton = React.memo(({ day }: DayButtonProps) => {
  const styles = useStyles(getStyles);

  const [selectedDate, selectDate] = useAtom(selectedDateAtom);
  const matchDays = useAtomValue(matchDaysAtom);
  const isMatchDay = useMemo(() => day in matchDays, [day, matchDays]);
  const isSelected = useMemo(() => day === selectedDate, [day, selectedDate]);

  const { formatDate } = useDate();

  return useMemo(() => {
    const date = new Date(day);
    const isToday = isSameDay(date, new Date());

    const dayContainerStyle =
      StyleSheet.flatten([
        styles.dayContainer,
        isMatchDay && styles.matchDayContainer,
        isToday && styles.todayContainer,
        isSelected && styles.selectedDayContainer,
      ]) ?? {};

    const textColor = (dayContainerStyle as { color?: string }).color;

    return (
      <TouchableOpacity
        disabled={!isMatchDay}
        onPress={() => {
          selectDate(getComparableDay(date));
        }}
        style={styles.container}>
        <View style={dayContainerStyle}>
          <Typographies.Body color={textColor}>{formatDate(date, 'EEE')}</Typographies.Body>
          <Typographies.Title2 color={textColor}>{formatDate(date, 'd')}</Typographies.Title2>
          <Typographies.Body color={textColor}>{formatDate(date, 'MMM')}</Typographies.Body>
        </View>
        {isMatchDay && <View style={styles.matchDayIndicator} />}
      </TouchableOpacity>
    );
  }, [isMatchDay, isSelected, selectDate, day]);
});

export const dayButtonConstants = {
  width: 36,
  padding: 12,
  margin: 8,
};

const getStyles = createStylesheet((theme) => ({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  dayContainer: {
    width: dayButtonConstants.width + dayButtonConstants.padding * 2,
    padding: dayButtonConstants.padding,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.colors.foreground,
    opacity: theme.opacities.priority2,
    marginHorizontal: dayButtonConstants.margin,
  },
  matchDayContainer: {
    opacity: theme.opacities.priority1,
  },
  matchDayIndicator: {
    borderRadius: 9999,
    width: 4,
    height: 4,
    backgroundColor: theme.colors.accent,
  },
  todayContainer: {
    borderWidth: 1,
    borderColor: theme.colors.accent,
    backgroundColor: 'transparent',
  },
  selectedDayContainer: {
    backgroundColor: theme.colors.accent,
    color: theme.colors.background,
  },
}));
