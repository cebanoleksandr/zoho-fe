import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiKeysService } from '../../api/services';
import { queryKeys } from '../../api/queryKeys';
import type { CreateApiKeyPayload } from '../../types';

export function useApiKeys() {
  return useQuery({
    queryKey: queryKeys.apiKeys.lists(),
    queryFn: () => apiKeysService.list(),
  });
}

export function useCreateApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateApiKeyPayload) => apiKeysService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.apiKeys.lists() });
    },
  });
}

export function useRevokeApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiKeysService.revoke(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.apiKeys.lists() });
    },
  });
}
