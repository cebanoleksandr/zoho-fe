import { apiClient } from '../client';
import type {
  CreateCustomFieldDefinitionPayload,
  CrmEntityType,
  CustomFieldDefinition,
  CustomFieldValue,
  SetCustomFieldValuesPayload,
  UpdateCustomFieldDefinitionPayload,
} from '../../types';

export const customFieldsService = {
  async listDefinitions(entityType?: CrmEntityType): Promise<CustomFieldDefinition[]> {
    const { data } = await apiClient.get<CustomFieldDefinition[]>('/custom-fields/definitions', {
      params: entityType ? { entityType } : undefined,
    });
    return data;
  },

  async getDefinition(id: string): Promise<CustomFieldDefinition> {
    const { data } = await apiClient.get<CustomFieldDefinition>(`/custom-fields/definitions/${id}`);
    return data;
  },

  async createDefinition(
    payload: CreateCustomFieldDefinitionPayload,
  ): Promise<CustomFieldDefinition> {
    const { data } = await apiClient.post<CustomFieldDefinition>(
      '/custom-fields/definitions',
      payload,
    );
    return data;
  },

  async updateDefinition(
    id: string,
    payload: UpdateCustomFieldDefinitionPayload,
  ): Promise<CustomFieldDefinition> {
    const { data } = await apiClient.patch<CustomFieldDefinition>(
      `/custom-fields/definitions/${id}`,
      payload,
    );
    return data;
  },

  async removeDefinition(id: string): Promise<void> {
    await apiClient.delete(`/custom-fields/definitions/${id}`);
  },

  async getValues(entityType: CrmEntityType, entityId: string): Promise<CustomFieldValue[]> {
    const { data } = await apiClient.get<CustomFieldValue[]>('/custom-fields/values', {
      params: { entityType, entityId },
    });
    return data;
  },

  async setValues(payload: SetCustomFieldValuesPayload): Promise<CustomFieldValue[]> {
    const { data } = await apiClient.put<CustomFieldValue[]>('/custom-fields/values', payload);
    return data;
  },
};
