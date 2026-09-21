import type { BaseEntity } from './common';

export const WebhookEvent = {
  ACCOUNT_CREATED: 'account.created',
  CONTACT_CREATED: 'contact.created',
  DEAL_CREATED: 'deal.created',
  DEAL_STAGE_CHANGED: 'deal.stage_changed',
  LEAD_CREATED: 'lead.created',
  LEAD_CONVERTED: 'lead.converted',
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
