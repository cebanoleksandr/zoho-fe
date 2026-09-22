import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { activitiesService } from '../../api/services';
import { queryKeys } from '../../api/queryKeys';
import type { CreateActivityPayload, QueryActivitiesParams, UpdateActivityPayload } from '../../types';

export function useActivities(params?: QueryActivitiesParams) {
  return useQuery({
    queryKey: queryKeys.activities.list(params),
    queryFn: () => activitiesService.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useActivity(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.activities.detail(id),
    queryFn: () => activitiesService.getById(id),
    enabled: enabled && !!id,
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateActivityPayload) => activitiesService.create(payload),
    meta: { alert: { entity: 'activity', action: 'create' } },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.lists() });
    },
  });
}

export function useUpdateActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateActivityPayload }) =>
      activitiesService.update(id, payload),
    meta: { alert: { entity: 'activity', action: 'update' } },
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(queryKeys.activities.detail(id), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.lists() });
    },
  });
}

export function useCompleteActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => activitiesService.complete(id),
    onSuccess: (data, id) => {
      queryClient.setQueryData(queryKeys.activities.detail(id), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.lists() });
    },
  });
}

export function useDeleteActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => activitiesService.remove(id),
    meta: { alert: { entity: 'activity', action: 'delete' } },
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.activities.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.lists() });
    },
  });
}
