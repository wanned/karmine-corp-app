import { useAssets } from 'expo-asset';

export const useGameImageAssets = () => {
  const [gameImageAssets] = useAssets([
    require('~/../assets/game-images/lol.png'),
    require('~/../assets/game-images/rl.png'),
    require('~/../assets/game-images/valorant.png'),
    require('~/../assets/game-images/tft.png'),
  ]);

  if (gameImageAssets === undefined) {
    return null;
  }

  return {
    lol: gameImageAssets[0],
    rl: gameImageAssets[1],
    valorant: gameImageAssets[2],
    tft: gameImageAssets[3],
  };
};
