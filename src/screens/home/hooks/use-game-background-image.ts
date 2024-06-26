import { useAssets } from 'expo-asset';

import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';

export const useGameBackgroundImage = () => {
  const [gameImageAssets] = useAssets([
    require('~/../assets/game-images/lol.png'),
    require('~/../assets/game-images/rl.png'),
    require('~/../assets/game-images/valorant.png'),
    require('~/../assets/game-images/tft.png'),
    require('~/../assets/game-images/fortnite.png'),
  ]);

  if (gameImageAssets === undefined) {
    return null;
  }

  const images: Partial<Record<CoreData.CompetitionName, (typeof gameImageAssets)[number]>> = {
    [CoreData.CompetitionName.LeagueOfLegendsLEC]: gameImageAssets[0],
    [CoreData.CompetitionName.LeagueOfLegendsLFL]: gameImageAssets[0],
    [CoreData.CompetitionName.RocketLeague]: gameImageAssets[1],
    [CoreData.CompetitionName.ValorantVCT]: gameImageAssets[2],
    [CoreData.CompetitionName.ValorantVCTGC]: gameImageAssets[2],
    [CoreData.CompetitionName.TeamfightTacticsGSC]: gameImageAssets[3],
    [CoreData.CompetitionName.TFT]: gameImageAssets[3],
    [CoreData.CompetitionName.Fortnite]: gameImageAssets[4],
  };

  return images;
};
