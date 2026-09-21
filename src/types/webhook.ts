import type { BaseEntity } from './common';

export const WebhookEvent = {
  ACCOUNT_CREATED: 'ACCOUNT_CREATED',
  CONTACT_CREATED: 'CONTACT_CREATED',
  DEAL_CREATED: 'DEAL_CREATED',
  DEAL_STAGE_CHANGED: 'DEAL_STAGE_CHANGED',
  LEAD_CREATED: 'LEAD_CREATED',
  LEAD_CONVERTED: 'LEAD_CONVERTED',
} as const;
export type WebhookEvent = (typeof WebhookEvent)[keyof typeof WebhookEvent];

export interface Webhook extends BaseEntity {
  url: string;
  secret: string;
  events: WebhookEvent[];
  isActive: boolean;
  description: string | null;
}

export interface CreateWebhookPayload {
  url: string;
  events: WebhookEvent[];
  isActive?: boolean;
  description?: string;
}

export type UpdateWebhookPayload = Partial<CreateWebhookPayload>;

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  event: WebhookEvent;
  statusCode: number | null;
  success: boolean;
  requestBody: string;
  responseBody: string | null;
  createdAt: string;
}
