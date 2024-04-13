import { useQuery } from '@tanstack/react-query';

import packageJson from '~/../package.json';

export const useLibraries = () => {
  const fetchLibraries = async () => {
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

    return Object.keys(dependencies)
      .sort()
      .map((library) => ({
        title: library,
      }));
  };

  return useQuery({
    queryKey: ['libraries'],
    queryFn: async () => await fetchLibraries(),
  });
};
