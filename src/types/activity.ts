import type { BaseEntity, PaginationQuery } from './common';

export const CrmEntityType = {
  ACCOUNT: 'ACCOUNT',
  CONTACT: 'CONTACT',
  DEAL: 'DEAL',
  LEAD: 'LEAD',
} as const;
export type CrmEntityType = (typeof CrmEntityType)[keyof typeof CrmEntityType];

export const ActivityType = {
  CALL: 'CALL',
  MEETING: 'MEETING',
  TASK: 'TASK',
  EMAIL: 'EMAIL',
  NOTE: 'NOTE',
} as const;
export type ActivityType = (typeof ActivityType)[keyof typeof ActivityType];

export const ActivityStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
} as const;
export type ActivityStatus = (typeof ActivityStatus)[keyof typeof ActivityStatus];

export interface Activity extends BaseEntity {
  entityType: CrmEntityType;
  entityId: string;
  type: ActivityType;
  subject: string;
  description: string | null;
  status: ActivityStatus;
  dueDate: string | null;
  completedAt: string | null;
  ownerId: string | null;
}

export interface CreateActivityPayload {
  entityType: CrmEntityType;
  entityId: string;
  type: ActivityType;
  subject: string;
  description?: string;
  dueDate?: string;
  ownerId?: string;
}

export type UpdateActivityPayload = Partial<CreateActivityPayload>;

export interface QueryActivitiesParams extends PaginationQuery {
  entityType?: CrmEntityType;
  entityId?: string;
  status?: ActivityStatus;
  ownerId?: string;
}
