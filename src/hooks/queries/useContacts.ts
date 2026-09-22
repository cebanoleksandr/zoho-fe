import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { contactsService } from '../../api/services';
import { queryKeys } from '../../api/queryKeys';
import type { CreateContactPayload, QueryContactsParams, UpdateContactPayload } from '../../types';

export function useContacts(params?: QueryContactsParams, enabled = true) {
  return useQuery({
    queryKey: queryKeys.contacts.list(params),
    queryFn: () => contactsService.list(params),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useContact(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.contacts.detail(id),
    queryFn: () => contactsService.getById(id),
    enabled: enabled && !!id,
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateContactPayload) => contactsService.create(payload),
    meta: { alert: { entity: 'contact', action: 'create' } },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.lists() });
    },
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateContactPayload }) =>
      contactsService.update(id, payload),
    meta: { alert: { entity: 'contact', action: 'update' } },
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(queryKeys.contacts.detail(id), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.lists() });
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contactsService.remove(id),
    meta: { alert: { entity: 'contact', action: 'delete' } },
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.contacts.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.lists() });
    },
  });
}
