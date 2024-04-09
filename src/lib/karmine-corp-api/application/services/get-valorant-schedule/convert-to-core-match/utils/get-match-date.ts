import { HTMLElement } from 'node-html-parser';

export function getMatchDate(matchElement: HTMLElement): Date | undefined {
  const dateStr = matchElement.querySelector('.m-item-date')?.textContent;
  if (!dateStr) return;

  return new Date(dateStr);
}
