import type { BaseEntity, PaginationQuery } from './common';

export interface Deal extends BaseEntity {
  name: string;
  amount: number | null;
  currency: string | null;
  accountId: string | null;
  contactId: string | null;
  pipelineId: string;
  stageId: string;
  ownerId: string | null;
  expectedCloseDate: string | null;
  closedAt: string | null;
  description: string | null;
}

export interface CreateDealPayload {
  name: string;
  amount?: number;
  currency?: string;
  accountId?: string;
  contactId?: string;
  pipelineId: string;
  stageId: string;
  ownerId?: string;
  expectedCloseDate?: string;
  description?: string;
}

export type UpdateDealPayload = Partial<CreateDealPayload>;

export interface QueryDealsParams extends PaginationQuery {
  search?: string;
  accountId?: string;
  pipelineId?: string;
  stageId?: string;
  ownerId?: string;
}

export interface UpdateDealStagePayload {
  stageId: string;
}
