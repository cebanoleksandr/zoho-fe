import { apiClient } from '../client';
import type {
  ConvertLeadPayload,
  ConvertLeadResponse,
  CreateLeadPayload,
  Lead,
  PaginatedResponse,
  QueryLeadsParams,
  UpdateLeadPayload,
  UpdateLeadStatusPayload,
} from '../../types';

export const leadsService = {
  async list(params?: QueryLeadsParams): Promise<PaginatedResponse<Lead>> {
    const { data } = await apiClient.get<PaginatedResponse<Lead>>('/leads', { params });
    return data;
  },

  async getById(id: string): Promise<Lead> {
    const { data } = await apiClient.get<Lead>(`/leads/${id}`);
    return data;
  },

  async create(payload: CreateLeadPayload): Promise<Lead> {
    const { data } = await apiClient.post<Lead>('/leads', payload);
    return data;
  },

  async update(id: string, payload: UpdateLeadPayload): Promise<Lead> {
    const { data } = await apiClient.patch<Lead>(`/leads/${id}`, payload);
    return data;
  },

  async updateStatus(id: string, payload: UpdateLeadStatusPayload): Promise<Lead> {
    const { data } = await apiClient.patch<Lead>(`/leads/${id}/status`, payload);
    return data;
  },

  async convert(id: string, payload: ConvertLeadPayload): Promise<ConvertLeadResponse> {
    const { data } = await apiClient.post<ConvertLeadResponse>(`/leads/${id}/convert`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/leads/${id}`);
  },
};
