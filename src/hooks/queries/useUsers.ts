import { useQuery } from '@tanstack/react-query';
import { usersService } from '../../api/services';
import { queryKeys } from '../../api/queryKeys';

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users.lists(),
    queryFn: () => usersService.list(),
  });
}

export function useUser(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => usersService.getById(id),
    enabled: enabled && !!id,
  });
}
