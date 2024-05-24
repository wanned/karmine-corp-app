import { useAssets } from 'expo-asset';

export function useAnonymousKcPlayerImage() {
  const [anonymousKcPlayerImageAsset] = useAssets([
    require('~/../assets/misc/anonymous_kc_player.png'),
  ]);

  return anonymousKcPlayerImageAsset?.[0].uri;
}
