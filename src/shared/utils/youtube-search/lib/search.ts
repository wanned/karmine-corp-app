// https://github.com/appit-online/youtube-search/blob/e1bedfa760d7c428fd14adbf1c52f46bc8cdcbc2/src/lib/search.ts

import { ParserService } from './parser.service';

interface MyObject {
  contents: any;
}

export async function searchVideo(searchQuery: string) {
  const YOUTUBE_URL = 'https://www.youtube.com';

  const results = [];
  let details = [];
  let fetched = false;
  const options = { type: 'video', limit: 0 };

  const searchRes = await fetch(`${YOUTUBE_URL}/results?q=${encodeURI(searchQuery.trim())}&hl=en`);

  let html = (await searchRes.text()) as any;
  // try to parse html
  try {
    const data = html.split("ytInitialData = '")[1].split("';</script>")[0];
    // @ts-ignore
    html = data.replace(/\\x([0-9A-F]{2})/gi, (...items) => {
      return String.fromCharCode(parseInt(items[1], 16));
    });
    html = html.replaceAll('\\\\"', '');
    html = JSON.parse(html);
  } catch (e) {
    /* nothing */
  }

  if (
    html &&
    html.contents &&
    html.contents.sectionListRenderer &&
    html.contents.sectionListRenderer.contents &&
    html.contents.sectionListRenderer.contents.length > 0 &&
    html.contents.sectionListRenderer.contents[0].itemSectionRenderer &&
    html.contents.sectionListRenderer.contents[0].itemSectionRenderer.contents.length > 0
  ) {
    details = html.contents.sectionListRenderer.contents[0].itemSectionRenderer.contents;
    fetched = true;
  }
  // backup/ alternative parsing
  if (!fetched) {
    try {
      details = JSON.parse(
        html
          .split('{"itemSectionRenderer":{"contents":')
          [html.split('{"itemSectionRenderer":{"contents":').length - 1].split(
            ',"continuations":[{'
          )[0]
      ) as any[];
      fetched = true;
    } catch (e) {
      /* nothing */
    }
  }
  if (!fetched) {
    try {
      details = (
        JSON.parse(
          html
            .split('{"itemSectionRenderer":')
            [html.split('{"itemSectionRenderer":').length - 1].split(
              '},{"continuationItemRenderer":{'
            )[0]
        ) as MyObject
      ).contents;
      fetched = true;
    } catch (e) {
      /* nothing */
    }
  }

  if (!fetched) return [];

  for (let i = 0; i < details.length; i++) {
    if (typeof options.limit === 'number' && options.limit > 0 && results.length >= options.limit)
      break;
    const data = details[i];

    const parserService = new ParserService();
    const parsed = parserService.parseVideo(data);
    if (!parsed) continue;
    const res = parsed;

    results.push(res);
  }

  return results;
}
