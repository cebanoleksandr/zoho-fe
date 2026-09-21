import type { BaseEntity, PaginationQuery } from './common';

export const CrmEntityType = {
  ACCOUNT: 'account',
  CONTACT: 'contact',
  DEAL: 'deal',
  LEAD: 'lead',
} as const;
export type CrmEntityType = (typeof CrmEntityType)[keyof typeof CrmEntityType];

export const ActivityType = {
  CALL: 'call',
  MEETING: 'meeting',
  TASK: 'task',
  EMAIL: 'email',
  NOTE: 'note',
} as const;
export type ActivityType = (typeof ActivityType)[keyof typeof ActivityType];

export const ActivityStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
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
