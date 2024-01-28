import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { useCalendarState } from '../hooks/use-calendar-state';

import { Typographies } from '~/shared/components/typographies';
import { useDate } from '~/shared/hooks/use-date';
import { useStyles } from '~/shared/hooks/use-styles';
import { createStylesheet } from '~/shared/styles/create-stylesheet';
import { isSameDay } from '~/shared/utils/is-same-day';

interface DayButtonProps {
  date: { date: Date; isMatchDay: boolean };
}

export const DayButton = React.memo(({ date: { date, isMatchDay } }: DayButtonProps) => {
  const styles = useStyles(getStyles);

  const isToday = useMemo(() => isSameDay(date, new Date()), [date]);

  const isSelected = useCalendarState(({ isSelected: isSameDay }) => isSameDay(date));
  const selectDate = useCalendarState(({ setSelectedDate }) => setSelectedDate);

  const { formatDate } = useDate();

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
        selectDate(date);
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
