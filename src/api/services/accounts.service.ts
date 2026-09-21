import { apiClient } from '../client';
import type {
  Account,
  CreateAccountPayload,
  PaginatedResponse,
  QueryAccountsParams,
  UpdateAccountPayload,
} from '../../types';

export const accountsService = {
  async list(params?: QueryAccountsParams): Promise<PaginatedResponse<Account>> {
    const { data } = await apiClient.get<PaginatedResponse<Account>>('/accounts', { params });
    return data;
  },

  async getById(id: string): Promise<Account> {
    const { data } = await apiClient.get<Account>(`/accounts/${id}`);
    return data;
  },

  async create(payload: CreateAccountPayload): Promise<Account> {
    const { data } = await apiClient.post<Account>('/accounts', payload);
    return data;
  },

  async update(id: string, payload: UpdateAccountPayload): Promise<Account> {
    const { data } = await apiClient.patch<Account>(`/accounts/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/accounts/${id}`);
  },
};
