import { useAssets } from 'expo-asset';

export function useAnonymousKcPlayerImage() {
  const [anonymousKcPlayerImageAsset] = useAssets([
    require('~/../assets/misc/anonymous-kc-player.png'),
  ]);

  return anonymousKcPlayerImageAsset?.[0].uri;
}
