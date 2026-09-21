import type { BaseEntity, PaginationQuery } from './common';

export interface Account extends BaseEntity {
  name: string;
  industry: string | null;
  website: string | null;
  phone: string | null;
  billingAddress: string | null;
  description: string | null;
  ownerId: string | null;
}

export interface CreateAccountPayload {
  name: string;
  industry?: string;
  website?: string;
  phone?: string;
  billingAddress?: string;
  description?: string;
  ownerId?: string;
}

export type UpdateAccountPayload = Partial<CreateAccountPayload>;

export interface QueryAccountsParams extends PaginationQuery {
  search?: string;
  ownerId?: string;
}
