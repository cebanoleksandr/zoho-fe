import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { dealsService } from '../../api/services';
import { queryKeys } from '../../api/queryKeys';
import type {
  CreateDealPayload,
  QueryDealsParams,
  UpdateDealPayload,
  UpdateDealStagePayload,
} from '../../types';

export function useDeals(params?: QueryDealsParams) {
  return useQuery({
    queryKey: queryKeys.deals.list(params),
    queryFn: () => dealsService.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useDeal(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.deals.detail(id),
    queryFn: () => dealsService.getById(id),
    enabled: enabled && !!id,
  });
}

export function useCreateDeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDealPayload) => dealsService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deals.lists() });
    },
  });
}

export function useUpdateDeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateDealPayload }) =>
      dealsService.update(id, payload),
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(queryKeys.deals.detail(id), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.deals.lists() });
    },
  });
}

export function useUpdateDealStage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateDealStagePayload }) =>
      dealsService.updateStage(id, payload),
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(queryKeys.deals.detail(id), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.deals.lists() });
    },
  });
}

export function useDeleteDeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => dealsService.remove(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.deals.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.deals.lists() });
    },
  });
}
