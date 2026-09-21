import { apiClient } from '../client';
import type {
  Contact,
  CreateContactPayload,
  PaginatedResponse,
  QueryContactsParams,
  UpdateContactPayload,
} from '../../types';

export const contactsService = {
  async list(params?: QueryContactsParams): Promise<PaginatedResponse<Contact>> {
    const { data } = await apiClient.get<PaginatedResponse<Contact>>('/contacts', { params });
    return data;
  },

  async getById(id: string): Promise<Contact> {
    const { data } = await apiClient.get<Contact>(`/contacts/${id}`);
    return data;
  },

  async create(payload: CreateContactPayload): Promise<Contact> {
    const { data } = await apiClient.post<Contact>('/contacts', payload);
    return data;
  },

  async update(id: string, payload: UpdateContactPayload): Promise<Contact> {
    const { data } = await apiClient.patch<Contact>(`/contacts/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/contacts/${id}`);
  },
};
