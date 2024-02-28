// https://github.com/appit-online/youtube-search/blob/e1bedfa760d7c428fd14adbf1c52f46bc8cdcbc2/src/index.ts

import { searchVideo } from './lib/search';

export const Name = (name: string) => `Hello ${name}`;

export function searchYoutube(searchQuery: string) {
  return searchVideo(searchQuery);
}
