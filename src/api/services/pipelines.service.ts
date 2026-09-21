import { apiClient } from '../client';
import type { Pipeline } from '../../types';

export const pipelinesService = {
  async list(): Promise<Pipeline[]> {
    const { data } = await apiClient.get<Pipeline[]>('/pipelines');
    return data;
  },

  async getById(id: string): Promise<Pipeline> {
    const { data } = await apiClient.get<Pipeline>(`/pipelines/${id}`);
    return data;
  },
};
