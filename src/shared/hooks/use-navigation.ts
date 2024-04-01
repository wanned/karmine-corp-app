import {
  NavigationContainerRef,
  StackActionHelpers,
  useNavigation as _useNavigation,
} from '@react-navigation/native';

import { ModalsParamList, PagesParamList } from '../navigation';

export type RootParamList = Omit<PagesParamList & ModalsParamList, 'root'>;

export const useNavigation = () => {
  const navigation = _useNavigation<NavigationContainerRef<RootParamList>>();

  return navigation as typeof navigation & StackActionHelpers<RootParamList>;
};
