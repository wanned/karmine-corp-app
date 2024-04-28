import { Effect, Option } from 'effect';
import { HTMLElement } from 'node-html-parser';

export function getMatchId(matchContainerElement: HTMLElement) {
  return Effect.Do.pipe(
    Effect.map(() => matchContainerElement.querySelector('[data-match-id]')),
    Effect.flatMap((_) => Option.fromNullable(_)),
    Effect.map((element) => element.getAttribute('data-match-id')),
    Effect.flatMap((_) => Option.fromNullable(_)),
    Effect.map((id) => `valo:${id}`)
  );
}
