import type { BaseEntity, PaginationQuery } from './common';

export const LeadSource = {
  WEB: 'WEB',
  REFERRAL: 'REFERRAL',
  EVENT: 'EVENT',
  COLD_CALL: 'COLD_CALL',
  OTHER: 'OTHER',
} as const;
export type LeadSource = (typeof LeadSource)[keyof typeof LeadSource];

export const LeadStatus = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  QUALIFIED: 'QUALIFIED',
  UNQUALIFIED: 'UNQUALIFIED',
  CONVERTED: 'CONVERTED',
} as const;
export type LeadStatus = (typeof LeadStatus)[keyof typeof LeadStatus];

export interface Lead extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  title: string | null;
  source: LeadSource | null;
  status: LeadStatus;
  ownerId: string | null;
  notes: string | null;
  convertedAt: string | null;
  convertedAccountId: string | null;
  convertedContactId: string | null;
  convertedDealId: string | null;
}

export interface CreateLeadPayload {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  company?: string;
  title?: string;
  source?: LeadSource;
  status?: LeadStatus;
  ownerId?: string;
  notes?: string;
}

export type UpdateLeadPayload = Partial<CreateLeadPayload>;

export interface QueryLeadsParams extends PaginationQuery {
  search?: string;
  status?: LeadStatus;
  ownerId?: string;
}

export interface UpdateLeadStatusPayload {
  status: LeadStatus;
}

export interface ConvertLeadPayload {
  accountName?: string;
  dealName?: string;
  pipelineId?: string;
  stageId?: string;
}

export interface ConvertLeadResponse {
  accountId: string;
  contactId: string;
  dealId: string | null;
}
