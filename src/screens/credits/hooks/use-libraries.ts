import { useQuery } from '@tanstack/react-query';

import packageJson from '~/../package.json';

export const useLibraries = () => {
  const fetchLibraries = async () => {
    const libraries = packageJson.dependencies;
    const devLibraries = packageJson.devDependencies;

    const librariesArray = Object.keys(libraries).map((library) => {
      return {
        title: library,
      };
    });

    const devLibrariesArray = Object.keys(devLibraries).map((library) => {
      return {
        title: library,
      };
    });

    return [...librariesArray, ...devLibrariesArray];
  };

  return useQuery({
    queryKey: ['libraries'],
    queryFn: async () => await fetchLibraries(),
  });
};
