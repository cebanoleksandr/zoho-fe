import { apiClient } from '../client';
import type {
  Activity,
  CreateActivityPayload,
  PaginatedResponse,
  QueryActivitiesParams,
  UpdateActivityPayload,
} from '../../types';

export const activitiesService = {
  async list(params?: QueryActivitiesParams): Promise<PaginatedResponse<Activity>> {
    const { data } = await apiClient.get<PaginatedResponse<Activity>>('/activities', { params });
    return data;
  },

  async getById(id: string): Promise<Activity> {
    const { data } = await apiClient.get<Activity>(`/activities/${id}`);
    return data;
  },

  async create(payload: CreateActivityPayload): Promise<Activity> {
    const { data } = await apiClient.post<Activity>('/activities', payload);
    return data;
  },

  async update(id: string, payload: UpdateActivityPayload): Promise<Activity> {
    const { data } = await apiClient.patch<Activity>(`/activities/${id}`, payload);
    return data;
  },

  async complete(id: string): Promise<Activity> {
    const { data } = await apiClient.patch<Activity>(`/activities/${id}/complete`);
    return data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/activities/${id}`);
  },
};
