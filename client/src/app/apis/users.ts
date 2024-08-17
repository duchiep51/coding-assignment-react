import { useQuery } from '@tanstack/react-query';

export const useUsers = () => {
  return useQuery({
    queryKey: ['user', 'list'],
    queryFn: () => fetch(`/api/users`).then((result) => result.json()),
  });
};

export const useUser = (userId?: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () =>
      fetch(`/api/users/${userId}`).then((result) => result.json()),
    enabled: !!userId,
  });
};
