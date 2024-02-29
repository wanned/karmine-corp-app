import { z } from "zod";
import { safeJsonParse } from "./safe-json-parse";

const YOUTUBE_URL = 'https://www.youtube.com';

const itemSectionRendererSchema = z.object({
  contents: z.array(z.unknown())
})

const videoTitleInRendererSchema = z.object({
  runs: z.array(
    z.object({
      text: z.string(),
    }),
  )
})

const videoWithContextRendererSchema = z.object({
  videoId: z.string(),
  headline: videoTitleInRendererSchema
})
const videoRendererSchema = z.object({
  videoId: z.string(),
  title: videoTitleInRendererSchema
})

export async function searchYoutube(query: string) {
  const searchRes = await fetch(`${YOUTUBE_URL}/results?q=${encodeURI(query.trim())}&hl=en`);

  const html = await searchRes.text();
  const ytInitialData = safeJsonParse(html
    .split("ytInitialData =")[1]
    .trim()
    .split("</script>")[0]
    .replace(/;$/, '')
    .replace(/^'/, '')
    .replace(/'$/, ''));

  const itemSectionRenderer = itemSectionRendererSchema.safeParse(findItemSectionRenderer(ytInitialData.data));
  if (!itemSectionRenderer.success) return [];

  return itemSectionRenderer.data.contents.map(data => {
    const parsed = parseVideo(data);
    if (!parsed) return;
    const res = parsed;

    return res;
  });
}

function findItemSectionRenderer(obj: unknown, level = 0): unknown {
  const MAX_LEVEL = 10

  if (level > MAX_LEVEL) {
    return
  }

  if ((typeof obj !== 'object' || obj === null) && !Array.isArray(obj)) {
    return
  }

  if ('itemSectionRenderer' in obj) {
    return obj.itemSectionRenderer
  }

  for (const deepObj of Object.values(obj)) {
    const deepResult = findItemSectionRenderer(deepObj, level + 1)

    if (deepResult) {
      return deepResult
    }
  }
}

function parseVideo(data: any) {
  const videoWithContextRenderer = videoWithContextRendererSchema.safeParse(data.videoWithContextRenderer);
  const videoRenderer = videoWithContextRenderer.success
    ? videoWithContextRenderer
    : videoRendererSchema.safeParse(data.videoRenderer)

  if (!videoRenderer.success) return;

  let label =
    ('headline' in videoRenderer.data ? videoRenderer.data.headline : videoRenderer.data.title)
      .runs[0].text.replace('\\\\', '\\');
  try {
    label = decodeURIComponent(label)
  } catch { }

  return {
    id: videoRenderer.data.videoId,
    url: `https://www.youtube.com/watch?v=${videoRenderer.data.videoId}`,
    label,
  }
}
