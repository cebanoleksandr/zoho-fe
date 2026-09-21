import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DataTable, { type DataTableColumn } from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useApiKeys, useCreateApiKey, useRevokeApiKey } from '../../hooks/queries';
import type { ApiKey } from '../../types';
import NewApiKeyDialog from './NewApiKeyDialog';

function ApiKeysPanel() {
  const { t } = useTranslation();
  const { data: apiKeys, isLoading, isError } = useApiKeys();
  const createApiKey = useCreateApiKey();
  const revokeApiKey = useRevokeApiKey();
  const [formOpen, setFormOpen] = useState(false);
  const [revokeId, setRevokeId] = useState<string | null>(null);
  const [newKey, setNewKey] = useState<string | null>(null);

  const schema = yup.object({
    name: yup.string().required(t('settings.apiKeys.validation.nameRequired')),
  });

  type ApiKeyFormValues = yup.InferType<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApiKeyFormValues>({
    resolver: yupResolver(schema),
    defaultValues: { name: '' },
  });

  const onSubmit = handleSubmit((values) => {
    createApiKey.mutate(
      { name: values.name },
      {
        onSuccess: (res) => {
          setNewKey(res.key);
          reset();
          setFormOpen(false);
        },
      },
    );
  });

  const columns: DataTableColumn<ApiKey>[] = [
    { key: 'name', header: t('settings.apiKeys.columns.name'), render: (r) => r.name },
    { key: 'prefix', header: t('settings.apiKeys.columns.prefix'), render: (r) => r.prefix },
    { key: 'scopes', header: t('settings.apiKeys.columns.scopes'), render: (r) => r.scopes.join(', ') },
    {
      key: 'status',
      header: t('settings.apiKeys.columns.status'),
      render: (r) =>
        r.isActive ? (
          <Chip size="small" label={t('settings.apiKeys.status.active')} color="success" variant="outlined" />
        ) : (
          <Chip size="small" label={t('settings.apiKeys.status.revoked')} color="default" variant="outlined" />
        ),
    },
    {
      key: 'createdAt',
      header: t('settings.apiKeys.columns.created'),
      render: (r) => new Date(r.createdAt).toLocaleDateString(),
    },
    {
      key: 'actions',
      header: '',
      width: 60,
      render: (r) =>
        r.isActive && (
          <Tooltip title={t('common.revoke')}>
            <IconButton size="small" onClick={() => setRevokeId(r.id)}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFormOpen(true)}>
          {t('settings.apiKeys.new')}
        </Button>
      </Box>

      <DataTable
        columns={columns}
        rows={apiKeys ?? []}
        getRowId={(r) => r.id}
        getRowSx={(r) => ({ opacity: r.isActive ? 1 : 0.5 })}
        isLoading={isLoading}
        isError={isError}
        emptyMessage={t('settings.apiKeys.empty')}
      />

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{t('settings.apiKeys.form.title')}</DialogTitle>
        <form onSubmit={onSubmit} noValidate>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 0.5 }}>
              <TextField
                label={t('common.name')}
                fullWidth
                autoFocus
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFormOpen(false)}>{t('common.cancel')}</Button>
            <Button type="submit" variant="contained" disabled={createApiKey.isPending}>
              {createApiKey.isPending ? t('common.creating') : t('common.create')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <ConfirmDialog
        open={!!revokeId}
        title={t('settings.apiKeys.revokeTitle')}
        description={t('settings.apiKeys.revokeDescription')}
        confirmLabel={t('common.revoke')}
        loading={revokeApiKey.isPending}
        onClose={() => setRevokeId(null)}
        onConfirm={() => {
          if (revokeId) revokeApiKey.mutate(revokeId, { onSuccess: () => setRevokeId(null) });
        }}
      />

      <NewApiKeyDialog apiKey={newKey} onClose={() => setNewKey(null)} />
    </Box>
  );
}

export default ApiKeysPanel;
