import { useQuery } from '@tanstack/react-query';

export const useContributors = () => {
  const fetchContributors = async () => {
    const response = await fetch('https://ungh.cc/repos/wanned/karmine-corp-app/contributors');
    const contributors = await response.json();

    const contributorsWithDetails = await Promise.all(
      contributors.contributors.map(async (contributor: { username: string }) => {
        const response = await fetch(`https://ungh.cc/users/${contributor.username}`);
        const details = await response.json();
        return {
          ...details,
        };
      })
    );

    return contributorsWithDetails;
  };

  return useQuery({
    queryKey: ['contributors'],
    queryFn: async () => await fetchContributors(),
  });
};
