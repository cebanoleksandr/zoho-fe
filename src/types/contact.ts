import type { BaseEntity, PaginationQuery } from './common';

export interface Contact extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  title: string | null;
  accountId: string | null;
  ownerId: string | null;
  notes: string | null;
}

export interface CreateContactPayload {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  title?: string;
  accountId?: string;
  ownerId?: string;
  notes?: string;
}

export type UpdateContactPayload = Partial<CreateContactPayload>;

export interface QueryContactsParams extends PaginationQuery {
  search?: string;
  accountId?: string;
  ownerId?: string;
}
