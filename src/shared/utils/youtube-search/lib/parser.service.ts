// https://github.com/appit-online/youtube-search/blob/e1bedfa760d7c428fd14adbf1c52f46bc8cdcbc2/src/lib/parser.service.ts

export class ParserService {
  parseVideo(data: any) {
    if (!data || !data.videoWithContextRenderer) return;
    let label = '';
    try {
      label = data.videoWithContextRenderer.headline.runs[0].text;
      label = label.replace('\\\\', '\\');
      try {
        label = decodeURIComponent(label);
      } catch (e) {
        // @ts-ignore
      }

      return {
        id: {
          videoId: data.videoWithContextRenderer.videoId,
        },
        url: `https://www.youtube.com/watch?v=${data.videoWithContextRenderer.videoId}`,
        label,
      };
    } catch (e) {
      return undefined;
    }
  }
}
