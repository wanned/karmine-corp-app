import { useQuery } from '@tanstack/react-query';

export const useContributors = () => {
  const fetchContributors = async () => {
    const response = await fetch('https://ungh.cc/repos/wanned/karmine-corp-app/contributors');
    const contributors = (await response.json()) as { contributors: { username: string }[] };

    const contributorsWithDetails = (await Promise.all(
      contributors.contributors.map((contributor) =>
        fetch(`https://ungh.cc/users/${contributor.username}`).then((res) => res.json())
      )
    )) as { user: { name: string; username: string; twitter: string } }[];

    return contributorsWithDetails;
  };

  return useQuery({
    queryKey: ['contributors'],
    queryFn: async () => await fetchContributors(),
  });
};
