import { CrmEntityType } from './activity';

export const CustomFieldType = {
  TEXT: 'text',
  NUMBER: 'number',
  DATE: 'date',
  BOOLEAN: 'boolean',
  SELECT: 'select',
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

export type CustomFieldValueType = string | number | boolean | null;

export type CustomFieldValueMap = Record<string, CustomFieldValueType>;

export interface SetCustomFieldValuesPayload {
  entityType: CrmEntityType;
  entityId: string;
  values: CustomFieldValueMap;
}

export { CrmEntityType };

