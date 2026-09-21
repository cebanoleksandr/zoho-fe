import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useCreatePipeline, useUpdatePipeline } from '../../hooks/queries';
import type { Pipeline } from '../../types';

interface PipelineFormDialogProps {
  open: boolean;
  pipeline?: Pipeline | null;
  onClose: () => void;
}

function PipelineFormDialog({ open, pipeline, onClose }: PipelineFormDialogProps) {
  const { t } = useTranslation();
  const createPipeline = useCreatePipeline();
  const updatePipeline = useUpdatePipeline();
  const isEditing = !!pipeline;

  const schema = yup.object({
    name: yup.string().required(t('pipelines.validation.nameRequired')),
  });

  type PipelineFormValues = yup.InferType<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PipelineFormValues>({ resolver: yupResolver(schema), defaultValues: { name: '' } });

  useEffect(() => {
    if (open) reset({ name: pipeline?.name ?? '' });
  }, [open, pipeline, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (values: PipelineFormValues) => {
    if (isEditing && pipeline) {
      updatePipeline.mutate(
        { id: pipeline.id, payload: { name: values.name } },
        { onSuccess: handleClose },
      );
    } else {
      createPipeline.mutate({ name: values.name }, { onSuccess: handleClose });
    }
  };

  const isPending = createPipeline.isPending || updatePipeline.isPending;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>{isEditing ? t('pipelines.form.editTitle') : t('pipelines.form.createTitle')}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent>
          {!isEditing && (
            <DialogContentText sx={{ mb: 2 }}>{t('pipelines.form.createHint')}</DialogContentText>
          )}
          <Stack spacing={2}>
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
          <Button onClick={handleClose}>{t('common.cancel')}</Button>
          <Button type="submit" variant="contained" disabled={isPending}>
            {isPending ? t('common.saving') : isEditing ? t('common.save') : t('common.create')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default PipelineFormDialog;
