import { useAssets } from 'expo-asset';

export function useGlanceImage() {
  const [glanceImage] = useAssets([require('~/../assets/players/glance-image.png')]);

  return glanceImage?.[0].uri;
}
