import { apiClient } from '../client';
import type { ApiKey, CreateApiKeyPayload, CreateApiKeyResponse } from '../../types';

export const apiKeysService = {
  async list(): Promise<ApiKey[]> {
    const { data } = await apiClient.get<ApiKey[]>('/api-keys');
    return data;
  },

  async create(payload: CreateApiKeyPayload): Promise<CreateApiKeyResponse> {
    const { data } = await apiClient.post<CreateApiKeyResponse>('/api-keys', payload);
    return data;
  },

  async revoke(id: string): Promise<void> {
    await apiClient.delete(`/api-keys/${id}`);
  },
};
