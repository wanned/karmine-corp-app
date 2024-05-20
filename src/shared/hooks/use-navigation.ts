import {
  NavigationProp,
  useNavigation as _useNavigation,
  StackActionHelpers,
} from '@react-navigation/native';

import { ModalsParamList, PagesParamList } from '../navigation';

export type RootParamList = PagesParamList & ModalsParamList;

export const useNavigation = () => {
  const navigation = _useNavigation<
    NavigationProp<RootParamList> & StackActionHelpers<RootParamList>
  >();

  return navigation;
};
