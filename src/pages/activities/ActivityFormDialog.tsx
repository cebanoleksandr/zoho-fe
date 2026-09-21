import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useCreateActivity } from '../../hooks/queries';
import { ActivityType, CrmEntityType, type CreateActivityPayload } from '../../types';

const schema = yup.object({
  entityType: yup.mixed<CrmEntityType>().oneOf(Object.values(CrmEntityType)).required('Entity type is required'),
  entityId: yup.string().required('Entity id is required'),
  type: yup.mixed<ActivityType>().oneOf(Object.values(ActivityType)).required('Type is required'),
  subject: yup.string().required('Subject is required'),
  description: yup.string().optional(),
  dueDate: yup.string().optional(),
  ownerId: yup.string().optional(),
});

type ActivityFormValues = yup.InferType<typeof schema>;

interface ActivityFormDialogProps {
  open: boolean;
  onClose: () => void;
}

function ActivityFormDialog({ open, onClose }: ActivityFormDialogProps) {
  const createActivity = useCreateActivity();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ActivityFormValues>({ resolver: yupResolver(schema) });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (payload: ActivityFormValues) => {
    createActivity.mutate(payload as CreateActivityPayload, { onSuccess: handleClose });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>New Activity</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            <TextField
              label="Subject"
              fullWidth
              {...register('subject')}
              error={!!errors.subject}
              helperText={errors.subject?.message}
            />
            <Controller
              name="type"
              control={control}
              defaultValue={undefined}
              render={({ field }) => (
                <TextField select label="Type" fullWidth {...field} value={field.value ?? ''} error={!!errors.type} helperText={errors.type?.message}>
                  {Object.values(ActivityType).map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Stack direction="row" spacing={2}>
              <Controller
                name="entityType"
                control={control}
                defaultValue={undefined}
                render={({ field }) => (
                  <TextField
                    select
                    label="Related to"
                    fullWidth
                    {...field}
                    value={field.value ?? ''}
                    error={!!errors.entityType}
                    helperText={errors.entityType?.message}
                  >
                    {Object.values(CrmEntityType).map((t) => (
                      <MenuItem key={t} value={t}>
                        {t}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <TextField
                label="Record ID"
                fullWidth
                {...register('entityId')}
                error={!!errors.entityId}
                helperText={errors.entityId?.message}
              />
            </Stack>
            <TextField
              label="Due date"
              type="date"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              {...register('dueDate')}
            />
            <TextField label="Description" fullWidth multiline minRows={2} {...register('description')} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={createActivity.isPending}>
            {createActivity.isPending ? 'Saving…' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default ActivityFormDialog;
