import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DataTable, { type DataTableColumn } from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useApiKeys, useCreateApiKey, useRevokeApiKey } from '../../hooks/queries';
import type { ApiKey } from '../../types';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  scopes: yup.array().of(yup.string().required()).min(1, 'At least one scope is required').required(),
});

type ApiKeyFormValues = yup.InferType<typeof schema>;

function ApiKeysPanel() {
  const { data: apiKeys, isLoading, isError } = useApiKeys();
  const createApiKey = useCreateApiKey();
  const revokeApiKey = useRevokeApiKey();
  const [formOpen, setFormOpen] = useState(false);
  const [revokeId, setRevokeId] = useState<string | null>(null);
  const [newKey, setNewKey] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApiKeyFormValues>({
    resolver: yupResolver(schema),
    defaultValues: { name: '', scopes: [] },
  });

  const onSubmit = handleSubmit((values) => {
    const scopes = String(values.scopes).split(',').map((s) => s.trim()).filter(Boolean);
    createApiKey.mutate(
      { name: values.name, scopes },
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
    { key: 'name', header: 'Name', render: (r) => r.name },
    { key: 'prefix', header: 'Prefix', render: (r) => r.prefix },
    { key: 'scopes', header: 'Scopes', render: (r) => r.scopes.join(', ') },
    { key: 'createdAt', header: 'Created', render: (r) => new Date(r.createdAt).toLocaleDateString() },
    {
      key: 'actions',
      header: '',
      width: 60,
      render: (r) => (
        <Tooltip title="Revoke">
          <IconButton size="small" onClick={() => setRevokeId(r.id)}>
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Box>
      {newKey && (
        <Alert severity="success" onClose={() => setNewKey(null)} sx={{ mb: 2 }}>
          New API key created — copy it now, it won&apos;t be shown again: <code>{newKey}</code>
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFormOpen(true)}>
          New API Key
        </Button>
      </Box>

      <DataTable
        columns={columns}
        rows={apiKeys ?? []}
        getRowId={(r) => r.id}
        isLoading={isLoading}
        isError={isError}
        emptyMessage="No API keys yet."
      />

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>New API Key</DialogTitle>
        <form onSubmit={onSubmit} noValidate>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 0.5 }}>
              <TextField
                label="Name"
                fullWidth
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
              <TextField
                label="Scopes (comma separated)"
                fullWidth
                placeholder="leads:read, deals:write"
                {...register('scopes')}
                error={!!errors.scopes}
                helperText={errors.scopes?.message}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={createApiKey.isPending}>
              {createApiKey.isPending ? 'Creating…' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <ConfirmDialog
        open={!!revokeId}
        title="Revoke API key?"
        description="Applications using this key will lose access immediately."
        confirmLabel="Revoke"
        loading={revokeApiKey.isPending}
        onClose={() => setRevokeId(null)}
        onConfirm={() => {
          if (revokeId) revokeApiKey.mutate(revokeId, { onSuccess: () => setRevokeId(null) });
        }}
      />
    </Box>
  );
}

export default ApiKeysPanel;
