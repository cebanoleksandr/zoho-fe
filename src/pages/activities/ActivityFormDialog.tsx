import { useForm, useWatch, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import RecordAutocomplete from '../../components/common/RecordAutocomplete';
import { useCreateActivity } from '../../hooks/queries';
import { ActivityType, CrmEntityType, type CreateActivityPayload } from '../../types';

interface ActivityFormDialogProps {
  open: boolean;
  onClose: () => void;
}

function ActivityFormDialog({ open, onClose }: ActivityFormDialogProps) {
  const { t } = useTranslation();
  const createActivity = useCreateActivity();

  const schema = yup.object({
    entityType: yup.mixed<CrmEntityType>().oneOf(Object.values(CrmEntityType)).required(t('activities.validation.entityTypeRequired')),
    entityId: yup.string().required(t('activities.validation.entityIdRequired')),
    type: yup.mixed<ActivityType>().oneOf(Object.values(ActivityType)).required(t('activities.validation.typeRequired')),
    subject: yup.string().required(t('activities.validation.subjectRequired')),
    description: yup.string().optional(),
    dueDate: yup.string().optional(),
    ownerId: yup.string().optional(),
  });

  type ActivityFormValues = yup.InferType<typeof schema>;

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ActivityFormValues>({ resolver: yupResolver(schema) });

  const entityType = useWatch({ control, name: 'entityType' });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (payload: ActivityFormValues) => {
    createActivity.mutate(payload as CreateActivityPayload, { onSuccess: handleClose });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('activities.form.title')}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            <TextField
              label={t('activities.form.subject')}
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
                <TextField
                  select
                  label={t('activities.form.type')}
                  fullWidth
                  {...field}
                  value={field.value ?? ''}
                  error={!!errors.type}
                  helperText={errors.type?.message}
                >
                  {Object.values(ActivityType).map((ty) => (
                    <MenuItem key={ty} value={ty}>
                      {ty}
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
                    label={t('activities.form.relatedTo')}
                    fullWidth
                    {...field}
                    value={field.value ?? ''}
                    error={!!errors.entityType}
                    helperText={errors.entityType?.message}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      setValue('entityId', '');
                    }}
                  >
                    {Object.values(CrmEntityType).map((ty) => (
                      <MenuItem key={ty} value={ty}>
                        {ty}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Controller
                name="entityId"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <RecordAutocomplete
                    entityType={entityType}
                    value={field.value || null}
                    onChange={(id) => field.onChange(id ?? '')}
                    label={t('activities.form.recordId')}
                    error={!!errors.entityId}
                    helperText={errors.entityId?.message}
                  />
                )}
              />
            </Stack>
            <TextField
              label={t('activities.form.dueDate')}
              type="date"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              {...register('dueDate')}
            />
            <TextField label={t('common.description')} fullWidth multiline minRows={2} {...register('description')} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('common.cancel')}</Button>
          <Button type="submit" variant="contained" disabled={createActivity.isPending}>
            {createActivity.isPending ? t('common.saving') : t('common.create')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default ActivityFormDialog;
