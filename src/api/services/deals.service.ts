import { apiClient } from '../client';
import type {
  CreateDealPayload,
  Deal,
  PaginatedResponse,
  QueryDealsParams,
  UpdateDealPayload,
  UpdateDealStagePayload,
} from '../../types';

export const dealsService = {
  async list(params?: QueryDealsParams): Promise<PaginatedResponse<Deal>> {
    const { data } = await apiClient.get<PaginatedResponse<Deal>>('/deals', { params });
    return data;
  },

  async getById(id: string): Promise<Deal> {
    const { data } = await apiClient.get<Deal>(`/deals/${id}`);
    return data;
  },

  async create(payload: CreateDealPayload): Promise<Deal> {
    const { data } = await apiClient.post<Deal>('/deals', payload);
    return data;
  },

  async update(id: string, payload: UpdateDealPayload): Promise<Deal> {
    const { data } = await apiClient.patch<Deal>(`/deals/${id}`, payload);
    return data;
  },

  async updateStage(id: string, payload: UpdateDealStagePayload): Promise<Deal> {
    const { data } = await apiClient.patch<Deal>(`/deals/${id}/stage`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/deals/${id}`);
  },
};
