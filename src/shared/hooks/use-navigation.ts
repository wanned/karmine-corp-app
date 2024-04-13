import {
  NavigationProp,
  useNavigation as _useNavigation,
  StackActionHelpers,
} from '@react-navigation/native';
import { useEffect } from 'react';

import { ModalsParamList, PagesParamList } from '../navigation';

export type RootParamList = Omit<PagesParamList & ModalsParamList, 'root'>;

export const useNavigation = () => {
  const navigation = _useNavigation<
    NavigationProp<RootParamList> & StackActionHelpers<RootParamList>
  >();

  return navigation;
};
