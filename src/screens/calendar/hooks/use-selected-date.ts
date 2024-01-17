import { create } from 'zustand';

import { IsoDate } from '~/shared/types/IsoDate';
import { isSameDay } from '~/shared/utils/is-same-day';

const generateDatesInRange = (start: Date, end: Date) => {
  const dates = [];
  const ONE_DAY = 86_400_000;
  for (let i = start.getTime(); i <= end.getTime(); i += ONE_DAY) {
    const date = new Date(i);
    dates.push(date);
  }
  return dates;
};

interface SelectedDateState {
  allIsoDays: IsoDate[];
  allMatchesDates: IsoDate[];
  setAllMatchesDates: (dates: IsoDate[]) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  isSelected: (date: Date) => boolean;
  isMatchDay: (date: Date) => boolean;
}

export const useSelectedDate = create<SelectedDateState>((set, get) => ({
  allIsoDays: [],
  allMatchesDates: [],
  setAllMatchesDates: (dates) => {
    const minDateTimestamp = Math.min(...dates.map((date) => new Date(date).getTime()));
    const maxDateTimestamp = Math.max(...dates.map((date) => new Date(date).getTime()));
    const minDate = new Date(minDateTimestamp);
    const maxDate = new Date(maxDateTimestamp);

    set({
      allMatchesDates: dates,
      allIsoDays: generateDatesInRange(minDate, maxDate).map(
        (date) => date.toISOString() as IsoDate
      ),
    });
  },
  selectedDate: new Date(),
  setSelectedDate: (date) => set({ selectedDate: date }),
  isSelected: (date) => isSameDay(date, get().selectedDate),
  isMatchDay: (date) =>
    get().allMatchesDates.some((matchDate) => isSameDay(date, new Date(matchDate))),
}));
