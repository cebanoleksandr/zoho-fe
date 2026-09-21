import { apiClient } from '../client';
import type {
  CreatePipelinePayload,
  CreateStagePayload,
  Pipeline,
  PipelineStage,
  ReorderStagesPayload,
  UpdatePipelinePayload,
  UpdateStagePayload,
} from '../../types';

export const pipelinesService = {
  async list(): Promise<Pipeline[]> {
    const { data } = await apiClient.get<Pipeline[]>('/pipelines');
    return data;
  },

  async getById(id: string): Promise<Pipeline> {
    const { data } = await apiClient.get<Pipeline>(`/pipelines/${id}`);
    return data;
  },

  async create(payload: CreatePipelinePayload): Promise<Pipeline> {
    const { data } = await apiClient.post<Pipeline>('/pipelines', payload);
    return data;
  },

  async update(id: string, payload: UpdatePipelinePayload): Promise<Pipeline> {
    const { data } = await apiClient.patch<Pipeline>(`/pipelines/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/pipelines/${id}`);
  },

  async addStage(pipelineId: string, payload: CreateStagePayload): Promise<PipelineStage> {
    const { data } = await apiClient.post<PipelineStage>(
      `/pipelines/${pipelineId}/stages`,
      payload,
    );
    return data;
  },

  async updateStage(
    pipelineId: string,
    stageId: string,
    payload: UpdateStagePayload,
  ): Promise<PipelineStage> {
    const { data } = await apiClient.patch<PipelineStage>(
      `/pipelines/${pipelineId}/stages/${stageId}`,
      payload,
    );
    return data;
  },

  async removeStage(pipelineId: string, stageId: string): Promise<void> {
    await apiClient.delete(`/pipelines/${pipelineId}/stages/${stageId}`);
  },

  async reorderStages(pipelineId: string, payload: ReorderStagesPayload): Promise<Pipeline> {
    const { data } = await apiClient.patch<Pipeline>(
      `/pipelines/${pipelineId}/stages/reorder`,
      payload,
    );
    return data;
  },
};
