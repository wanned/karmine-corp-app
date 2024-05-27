import { Effect, Option } from 'effect';
import { HTMLElement } from 'node-html-parser';

import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';

export function getGameDetails(mapElement: HTMLElement) {
  return Effect.all(
    {
      mapName: getMapName(mapElement),
      score: getScore(mapElement),
      composition: Effect.all(
        {
          home: getComposition(mapElement, 'home'),
          away: getComposition(mapElement, 'away'),
        },
        {
          concurrency: 1,
        }
      ),
    },
    {
      concurrency: 1,
    }
  ) satisfies Effect.Effect<CoreData.ValorantGame, any, any>;
}

function getMapName(mapElement: HTMLElement) {
  return Option.Do.pipe(
    Option.flatMap(() =>
      Option.fromNullable(mapElement.querySelector('.m-item-games-result .map')?.text)
    ),
    Option.map((mapName) => mapName.trim())
  );
}

function getScore(mapElement: HTMLElement) {
  return Option.Do.pipe(
    Option.flatMap(() =>
      Option.fromNullable(mapElement.querySelector('.m-item-games-result .score')?.text)
    ),
    Option.map((score) => score.split('-').map((r) => parseInt(r.trim(), 10))),
    Option.map(([home, away]) => ({ home, away }))
  );
}

function getComposition(mapElement: HTMLElement, side: 'home' | 'away') {
  return Effect.Do.pipe(
    Effect.map(() =>
      mapElement.querySelectorAll(
        `.m-item-games-comp${
          side === 'home' ? ':not(.mod-right)' : '.mod-right'
        } .m-item-games-comp-group img`
      )
    ),
    Effect.flatMap(Effect.forEach(getCharacterDetails))
  );
}

function getCharacterDetails(characterElement: HTMLElement) {
  return Effect.map(
    Effect.all(
      {
        name: getCharacterName(characterElement),
        imageUrl: getCharacterImageUrl(characterElement),
      },
      {
        concurrency: 1,
      }
    ),
    (character) => ({ agent: character })
  );
}

function getCharacterName(characterElement: HTMLElement) {
  return Option.Do.pipe(
    Option.flatMap(() => Option.fromNullable(characterElement.getAttribute('src'))),
    Option.map((src) => src.split('/').pop()?.replace('.png', '')),
    Option.flatMap(Option.fromNullable),
    Option.map((name) => `${name[0].toUpperCase()}${name.slice(1)}`)
  );
}

function getCharacterImageUrl(characterElement: HTMLElement) {
  return Option.Do.pipe(
    Option.flatMap(() => Option.fromNullable(characterElement.getAttribute('src'))),
    Option.map((src) => `https://www.vlr.gg${src}`)
  );
}
