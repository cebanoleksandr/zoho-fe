import { CrmEntityType } from './activity';

export const CustomFieldType = {
  TEXT: 'TEXT',
  NUMBER: 'NUMBER',
  DATE: 'DATE',
  BOOLEAN: 'BOOLEAN',
  SELECT: 'SELECT',
} as const;
export type CustomFieldType = (typeof CustomFieldType)[keyof typeof CustomFieldType];

export interface CustomFieldDefinition {
  id: string;
  organizationId: string;
  entityType: CrmEntityType;
  fieldKey: string;
  label: string;
  fieldType: CustomFieldType;
  options: string[] | null;
  required: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomFieldDefinitionPayload {
  entityType: CrmEntityType;
  fieldKey: string;
  label: string;
  fieldType: CustomFieldType;
  options?: string[];
  required?: boolean;
}

export type UpdateCustomFieldDefinitionPayload = Partial<CreateCustomFieldDefinitionPayload>;

export interface CustomFieldValue {
  fieldKey: string;
  value: unknown;
}

export interface SetCustomFieldValuesPayload {
  entityType: CrmEntityType;
  entityId: string;
  values: CustomFieldValue[];
}

export { CrmEntityType };

