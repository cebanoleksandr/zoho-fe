import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { accountsService } from '../../api/services';
import { queryKeys } from '../../api/queryKeys';
import type { CreateAccountPayload, QueryAccountsParams, UpdateAccountPayload } from '../../types';

export function useAccounts(params?: QueryAccountsParams, enabled = true) {
  return useQuery({
    queryKey: queryKeys.accounts.list(params),
    queryFn: () => accountsService.list(params),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useAccount(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.accounts.detail(id),
    queryFn: () => accountsService.getById(id),
    enabled: enabled && !!id,
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAccountPayload) => accountsService.create(payload),
    meta: { alert: { entity: 'account', action: 'create' } },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.lists() });
    },
  });
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAccountPayload }) =>
      accountsService.update(id, payload),
    meta: { alert: { entity: 'account', action: 'update' } },
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(queryKeys.accounts.detail(id), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.lists() });
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => accountsService.remove(id),
    meta: { alert: { entity: 'account', action: 'delete' } },
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.accounts.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.lists() });
    },
  });
}
