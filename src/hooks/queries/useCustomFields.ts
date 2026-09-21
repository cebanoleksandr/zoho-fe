import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { customFieldsService } from '../../api/services';
import { queryKeys } from '../../api/queryKeys';
import type {
  CreateCustomFieldDefinitionPayload,
  CrmEntityType,
  SetCustomFieldValuesPayload,
  UpdateCustomFieldDefinitionPayload,
} from '../../types';

export function useCustomFieldDefinitions(entityType?: CrmEntityType) {
  return useQuery({
    queryKey: queryKeys.customFields.definitions(entityType),
    queryFn: () => customFieldsService.listDefinitions(entityType),
  });
}

export function useCustomFieldDefinition(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.customFields.definition(id),
    queryFn: () => customFieldsService.getDefinition(id),
    enabled: enabled && !!id,
  });
}

export function useCustomFieldValues(entityType: CrmEntityType, entityId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.customFields.values(entityType, entityId),
    queryFn: () => customFieldsService.getValues(entityType, entityId),
    enabled: enabled && !!entityType && !!entityId,
  });
}

export function useCreateCustomFieldDefinition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCustomFieldDefinitionPayload) =>
      customFieldsService.createDefinition(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customFields.all });
    },
  });
}

export function useUpdateCustomFieldDefinition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCustomFieldDefinitionPayload }) =>
      customFieldsService.updateDefinition(id, payload),
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(queryKeys.customFields.definition(id), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.customFields.all });
    },
  });
}

export function useDeleteCustomFieldDefinition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => customFieldsService.removeDefinition(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.customFields.definition(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.customFields.all });
    },
  });
}

export function useSetCustomFieldValues() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SetCustomFieldValuesPayload) => customFieldsService.setValues(payload),
    onSuccess: (_data, payload) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.customFields.values(payload.entityType, payload.entityId),
      });
    },
  });
}
