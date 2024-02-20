import * as datefns from 'date-fns';

export const dayUtils = {
  get today() {
    const today = datefns.startOfDay(new Date());
    return createNewDate(today);
  },
  get yesterday() {
    return this.today.addDays(-1);
  },
  get tomorrow() {
    return this.today.addDays(1);
  },
  get nextWeek() {
    return this.today.addWeeks(1);
  },
};

const createNewDate = (_date: Date): NewDate => {
  const date = _date as ReturnType<typeof createNewDate>;

  date.addSeconds = (seconds: number) => createNewDate(datefns.addSeconds(date, seconds));
  date.addMinutes = (minutes: number) => createNewDate(datefns.addMinutes(date, minutes));
  date.addHours = (hours: number) => createNewDate(datefns.addHours(date, hours));
  date.addDays = (days: number) => createNewDate(datefns.addDays(date, days));
  date.addWeeks = (weeks: number) => createNewDate(datefns.addWeeks(date, weeks));
  date.addMonths = (months: number) => createNewDate(datefns.addMonths(date, months));

  return date;
};

type NewDate = Date & {
  addSeconds(seconds: number): NewDate;
  addMinutes(minutes: number): NewDate;
  addHours(hours: number): NewDate;
  addDays(days: number): NewDate;
  addWeeks(weeks: number): NewDate;
  addMonths(months: number): NewDate;
};
