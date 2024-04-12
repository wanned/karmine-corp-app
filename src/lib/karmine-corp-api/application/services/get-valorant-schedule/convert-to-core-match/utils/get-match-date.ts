import { HTMLElement } from 'node-html-parser';

export function getMatchDate(matchElement: HTMLElement): Date | undefined {
  let dateStr = matchElement.querySelector('.m-item-date')?.textContent;

  // Fix dateStr (e.g. "   2024/04/10    10:00 pm   " -> "2024-04-10T22:00:00")
  dateStr = dateStr?.replace(
    /\s*(\d{4})\/(\d{2})\/(\d{2})\s+(\d{1,2}):(\d{2})\s+(am|pm)\s*/i,
    (_, year, month, day, hours, minutes, ampm) => {
      return `${year}-${month}-${day}T${
        parseInt(hours, 10) + (ampm.toLowerCase() === 'pm' ? 12 : 0)
      }:${minutes}:00`;
    }
  );

  if (!dateStr) return;

  return new Date(dateStr);
}
