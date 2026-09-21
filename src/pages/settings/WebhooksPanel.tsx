import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DataTable, { type DataTableColumn } from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useWebhooks, useCreateWebhook, useDeleteWebhook, useUpdateWebhook } from '../../hooks/queries';
import { WebhookEvent, type CreateWebhookPayload, type Webhook } from '../../types';

const schema = yup.object({
  url: yup.string().url('Must be a valid URL').required('URL is required'),
  events: yup.array().of(yup.mixed<WebhookEvent>().oneOf(Object.values(WebhookEvent)).required()).min(1, 'Select at least one event').required(),
  isActive: yup.boolean().optional(),
  description: yup.string().optional(),
});

type WebhookFormValues = yup.InferType<typeof schema>;

function WebhooksPanel() {
  const { data: webhooks, isLoading, isError } = useWebhooks();
  const createWebhook = useCreateWebhook();
  const updateWebhook = useUpdateWebhook();
  const deleteWebhook = useDeleteWebhook();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WebhookFormValues>({ resolver: yupResolver(schema), defaultValues: { events: [] } });

  const onSubmit = handleSubmit((payload) => {
    createWebhook.mutate(payload as CreateWebhookPayload, {
      onSuccess: () => {
        reset();
        setFormOpen(false);
      },
    });
  });

  const columns: DataTableColumn<Webhook>[] = [
    { key: 'url', header: 'URL', render: (r) => r.url },
    { key: 'events', header: 'Events', render: (r) => r.events.join(', ') },
    {
      key: 'active',
      header: 'Active',
      width: 90,
      render: (r) => (
        <Switch
          size="small"
          checked={r.isActive}
          onChange={(e) => updateWebhook.mutate({ id: r.id, payload: { isActive: e.target.checked } })}
        />
      ),
    },
    {
      key: 'actions',
      header: '',
      width: 60,
      render: (r) => (
        <Tooltip title="Delete">
          <IconButton size="small" onClick={() => setDeleteId(r.id)}>
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
          New Webhook
        </Button>
      </Box>

      <DataTable
        columns={columns}
        rows={webhooks ?? []}
        getRowId={(r) => r.id}
        isLoading={isLoading}
        isError={isError}
        emptyMessage="No webhooks configured."
      />

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>New Webhook</DialogTitle>
        <form onSubmit={onSubmit} noValidate>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 0.5 }}>
              <TextField
                label="URL"
                fullWidth
                placeholder="https://example.com/webhook"
                {...register('url')}
                error={!!errors.url}
                helperText={errors.url?.message}
              />
              <Controller
                name="events"
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    label="Events"
                    fullWidth
                    slotProps={{ select: { multiple: true } }}
                    value={field.value ?? []}
                    onChange={field.onChange}
                    error={!!errors.events}
                    helperText={errors.events?.message}
                  >
                    {Object.values(WebhookEvent).map((ev) => (
                      <MenuItem key={ev} value={ev}>
                        {ev}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <TextField label="Description" fullWidth multiline minRows={2} {...register('description')} />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={createWebhook.isPending}>
              {createWebhook.isPending ? 'Creating…' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete webhook?"
        description="This action cannot be undone."
        loading={deleteWebhook.isPending}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteWebhook.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
        }}
      />
    </Box>
  );
}

export default WebhooksPanel;
