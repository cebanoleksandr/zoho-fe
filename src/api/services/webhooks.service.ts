import { apiClient } from '../client';
import type {
  CreateWebhookPayload,
  UpdateWebhookPayload,
  Webhook,
  WebhookDelivery,
} from '../../types';

export const webhooksService = {
  async list(): Promise<Webhook[]> {
    const { data } = await apiClient.get<Webhook[]>('/webhooks');
    return data;
  },

  async getById(id: string): Promise<Webhook> {
    const { data } = await apiClient.get<Webhook>(`/webhooks/${id}`);
    return data;
  },

  async create(payload: CreateWebhookPayload): Promise<Webhook> {
    const { data } = await apiClient.post<Webhook>('/webhooks', payload);
    return data;
  },

  async update(id: string, payload: UpdateWebhookPayload): Promise<Webhook> {
    const { data } = await apiClient.patch<Webhook>(`/webhooks/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/webhooks/${id}`);
  },

  async getDeliveries(id: string): Promise<WebhookDelivery[]> {
    const { data } = await apiClient.get<WebhookDelivery[]>(`/webhooks/${id}/deliveries`);
    return data;
  },
};
