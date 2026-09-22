import { MutationCache, QueryClient } from '@tanstack/react-query';
import i18n from '../i18n';
import { store } from '../store/store';
import { setAlertAC } from '../store/alertSlice';

export type EntityKey =
  | 'lead'
  | 'contact'
  | 'account'
  | 'deal'
  | 'activity'
  | 'pipeline'
  | 'stage'
  | 'customField'
  | 'apiKey'
  | 'webhook';

export type MutationAction = 'create' | 'update' | 'delete';

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      alert?: {
        entity: EntityKey;
        action: MutationAction;
      };
    };
  }
}

const successKeyByAction: Record<MutationAction, string> = {
  create: 'alerts.createSuccess',
  update: 'alerts.updateSuccess',
  delete: 'alerts.deleteSuccess',
};

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  if (error instanceof Error && error.message) return error.message;
  return i18n.t('common.errorLoading');
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      const alertMeta = mutation.meta?.alert;
      if (!alertMeta) return;

      const entity = i18n.t(`entities.${alertMeta.entity}`);
      store.dispatch(
        setAlertAC({
          text: i18n.t(successKeyByAction[alertMeta.action], { entity }),
          mode: 'success',
        }),
      );
    },
    onError: (error, _variables, _context, mutation) => {
      if (!mutation.meta?.alert) return;

      store.dispatch(
        setAlertAC({
          text: getErrorMessage(error),
          mode: 'error',
        }),
      );
    },
  }),
});
