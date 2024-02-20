class DurationToMilliseconds {
  private static readonly SECONDS_TO_MILLISECONDS = 1000;
  private static readonly MINUTES_TO_MILLISECONDS = 60 * this.SECONDS_TO_MILLISECONDS;
  private static readonly HOURS_TO_MILLISECONDS = 60 * this.MINUTES_TO_MILLISECONDS;
  private static readonly DAYS_TO_MILLISECONDS = 24 * this.HOURS_TO_MILLISECONDS;

  static fromSeconds(seconds: number): number {
    return seconds * this.SECONDS_TO_MILLISECONDS;
  }

  static fromMinutes(minutes: number): number {
    return minutes * this.MINUTES_TO_MILLISECONDS;
  }

  static fromHours(hours: number): number {
    return hours * this.HOURS_TO_MILLISECONDS;
  }

  static fromDays(days: number): number {
    return days * this.DAYS_TO_MILLISECONDS;
  }
}

export const durationUtils = {
  toMs: DurationToMilliseconds,
};
