import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { pipelinesService } from '../../api/services';
import { queryKeys } from '../../api/queryKeys';
import type {
  CreatePipelinePayload,
  CreateStagePayload,
  ReorderStagesPayload,
  UpdatePipelinePayload,
  UpdateStagePayload,
} from '../../types';

export function usePipelines() {
  return useQuery({
    queryKey: queryKeys.pipelines.lists(),
    queryFn: () => pipelinesService.list(),
  });
}

export function usePipeline(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.pipelines.detail(id),
    queryFn: () => pipelinesService.getById(id),
    enabled: enabled && !!id,
  });
}

export function useCreatePipeline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePipelinePayload) => pipelinesService.create(payload),
    meta: { alert: { entity: 'pipeline', action: 'create' } },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pipelines.lists() });
    },
  });
}

export function useUpdatePipeline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePipelinePayload }) =>
      pipelinesService.update(id, payload),
    meta: { alert: { entity: 'pipeline', action: 'update' } },
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(queryKeys.pipelines.detail(id), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.pipelines.lists() });
    },
  });
}

export function useDeletePipeline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => pipelinesService.remove(id),
    meta: { alert: { entity: 'pipeline', action: 'delete' } },
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.pipelines.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.pipelines.lists() });
    },
  });
}

export function useAddStage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ pipelineId, payload }: { pipelineId: string; payload: CreateStagePayload }) =>
      pipelinesService.addStage(pipelineId, payload),
    meta: { alert: { entity: 'stage', action: 'create' } },
    onSuccess: (_data, { pipelineId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pipelines.detail(pipelineId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.pipelines.lists() });
    },
  });
}

export function useUpdateStage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      pipelineId,
      stageId,
      payload,
    }: {
      pipelineId: string;
      stageId: string;
      payload: UpdateStagePayload;
    }) => pipelinesService.updateStage(pipelineId, stageId, payload),
    meta: { alert: { entity: 'stage', action: 'update' } },
    onSuccess: (_data, { pipelineId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pipelines.detail(pipelineId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.pipelines.lists() });
    },
  });
}

export function useRemoveStage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ pipelineId, stageId }: { pipelineId: string; stageId: string }) =>
      pipelinesService.removeStage(pipelineId, stageId),
    meta: { alert: { entity: 'stage', action: 'delete' } },
    onSuccess: (_data, { pipelineId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pipelines.detail(pipelineId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.pipelines.lists() });
    },
  });
}

export function useReorderStages() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      pipelineId,
      payload,
    }: {
      pipelineId: string;
      payload: ReorderStagesPayload;
    }) => pipelinesService.reorderStages(pipelineId, payload),
    onSuccess: (data, { pipelineId }) => {
      queryClient.setQueryData(queryKeys.pipelines.detail(pipelineId), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.pipelines.lists() });
    },
  });
}
