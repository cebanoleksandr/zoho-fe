import { apiClient } from '../client';
import type {
  CreateCustomFieldDefinitionPayload,
  CrmEntityType,
  CustomFieldDefinition,
  CustomFieldValueMap,
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

  async getValues(entityType: CrmEntityType, entityId: string): Promise<CustomFieldValueMap> {
    const { data } = await apiClient.get<CustomFieldValueMap>('/custom-fields/values', {
      params: { entityType, entityId },
    });
    return data;
  },

  async setValues(payload: SetCustomFieldValuesPayload): Promise<CustomFieldValueMap> {
    const { data } = await apiClient.put<CustomFieldValueMap>('/custom-fields/values', payload);
    return data;
  },
};
