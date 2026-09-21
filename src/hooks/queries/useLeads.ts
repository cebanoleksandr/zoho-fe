import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { leadsService } from '../../api/services';
import { queryKeys } from '../../api/queryKeys';
import type {
  ConvertLeadPayload,
  CreateLeadPayload,
  QueryLeadsParams,
  UpdateLeadPayload,
  UpdateLeadStatusPayload,
} from '../../types';

export function useLeads(params?: QueryLeadsParams) {
  return useQuery({
    queryKey: queryKeys.leads.list(params),
    queryFn: () => leadsService.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useLead(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.leads.detail(id),
    queryFn: () => leadsService.getById(id),
    enabled: enabled && !!id,
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLeadPayload) => leadsService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.lists() });
    },
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateLeadPayload }) =>
      leadsService.update(id, payload),
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(queryKeys.leads.detail(id), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.lists() });
    },
  });
}

export function useUpdateLeadStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateLeadStatusPayload }) =>
      leadsService.updateStatus(id, payload),
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(queryKeys.leads.detail(id), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.lists() });
    },
  });
}

export function useConvertLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ConvertLeadPayload }) =>
      leadsService.convert(id, payload),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.deals.lists() });
    },
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leadsService.remove(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.leads.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.lists() });
    },
  });
}
