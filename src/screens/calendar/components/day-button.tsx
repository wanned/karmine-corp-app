import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { useSelectedDate } from '../hooks/use-selected-date';

import { Typographies } from '~/shared/components/typographies';
import { useDate } from '~/shared/hooks/use-date';
import { useStyles } from '~/shared/hooks/use-styles';
import { createStylesheet } from '~/shared/styles/create-stylesheet';
import { isSameDay } from '~/shared/utils/is-same-day';

interface DayButtonProps {
  isoDay: string;
}

export const DayButton = React.memo(({ isoDay }: DayButtonProps) => {
  const styles = useStyles(getStyles);

  const day = useMemo(() => new Date(isoDay), [isoDay]);
  const isToday = useMemo(() => isSameDay(day, new Date()), [day]);

  const isSelected = useSelectedDate(({ isSelected: isSameDay }) => isSameDay(day));
  const isMatchDay = useSelectedDate(({ isMatchDay }) => isMatchDay(day));
  const selectDate = useSelectedDate(({ setSelectedDate }) => setSelectedDate);

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
        selectDate(day);
      }}
      style={styles.container}>
      <View style={dayContainerStyle}>
        <Typographies.Body color={textColor}>{formatDate(day, 'EEE')}</Typographies.Body>
        <Typographies.Title2 color={textColor}>{formatDate(day, 'd')}</Typographies.Title2>
        <Typographies.Body color={textColor}>{formatDate(day, 'MMM')}</Typographies.Body>
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
