import { NavigationContainerRef, useNavigation as _useNavigation } from '@react-navigation/native';

import { ModalsParamList, PagesParamList } from '../navigation';

export const useNavigation = () => {
  const navigation =
    _useNavigation<NavigationContainerRef<Omit<PagesParamList & ModalsParamList, 'root'>>>();

  return navigation;
};
