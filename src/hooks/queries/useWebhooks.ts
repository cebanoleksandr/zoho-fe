import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { webhooksService } from '../../api/services';
import { queryKeys } from '../../api/queryKeys';
import type { CreateWebhookPayload, UpdateWebhookPayload } from '../../types';

export function useWebhooks() {
  return useQuery({
    queryKey: queryKeys.webhooks.lists(),
    queryFn: () => webhooksService.list(),
  });
}

export function useWebhook(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.webhooks.detail(id),
    queryFn: () => webhooksService.getById(id),
    enabled: enabled && !!id,
  });
}

export function useWebhookDeliveries(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.webhooks.deliveries(id),
    queryFn: () => webhooksService.getDeliveries(id),
    enabled: enabled && !!id,
  });
}

export function useCreateWebhook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateWebhookPayload) => webhooksService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.webhooks.lists() });
    },
  });
}

export function useUpdateWebhook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateWebhookPayload }) =>
      webhooksService.update(id, payload),
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(queryKeys.webhooks.detail(id), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.webhooks.lists() });
    },
  });
}

export function useDeleteWebhook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => webhooksService.remove(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.webhooks.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.webhooks.lists() });
    },
  });
}
