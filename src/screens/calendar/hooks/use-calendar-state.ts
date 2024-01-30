import { create } from 'zustand';

import { isSameDay } from '~/shared/utils/is-same-day';

const generateDatesInRange = (start: Date, end: Date) => {
  // We need to set the hours to 12:00:00 to avoid issues with daylight saving time
  start.setHours(12, 0, 0, 0);
  end.setHours(12, 0, 0, 0);

  const dates = [];
  const ONE_DAY = 86_400_000;
  for (let i = start.getTime(); i <= end.getTime(); i += ONE_DAY) {
    const date = new Date(i);
    dates.push(date);
  }
  return dates;
};

interface CalendarState {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  isSelected: (date: Date) => boolean;
  dates: { date: Date; isMatchDay: boolean }[];
  setMatchesDates: (dates: Date[]) => void;
  isMatchDay: (date: Date) => boolean;
}

export const useCalendarState = create<CalendarState>((set, get) => ({
  dates: [],
  setMatchesDates: (dates) => {
    const minDateTimestamp = Math.min(...dates.map((date) => new Date(date).getTime()));
    const minDate = new Date(minDateTimestamp);

    const maxDateTimestamp = Math.max(...dates.map((date) => new Date(date).getTime()));
    const maxDate = new Date(maxDateTimestamp);

    const datesInRange = generateDatesInRange(minDate, maxDate);

    const datesWithMatch = datesInRange.map((date) => ({
      date,
      isMatchDay: dates.some((matchDate) => isSameDay(date, matchDate)),
    }));

    set({ dates: datesWithMatch });
  },
  selectedDate: new Date(),
  setSelectedDate: (date) => set({ selectedDate: date }),
  isSelected: (date) => isSameDay(date, get().selectedDate),
  isMatchDay: (date) =>
    get().dates.find((dateWithMatch) => isSameDay(date, dateWithMatch.date))?.isMatchDay ?? false,
}));
