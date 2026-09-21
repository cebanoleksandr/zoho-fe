import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useAddStage, useUpdateStage } from '../../hooks/queries';
import type { PipelineStage } from '../../types';

interface StageFormDialogProps {
  open: boolean;
  pipelineId: string;
  stage?: PipelineStage | null;
  onClose: () => void;
}

function StageFormDialog({ open, pipelineId, stage, onClose }: StageFormDialogProps) {
  const { t } = useTranslation();
  const addStage = useAddStage();
  const updateStage = useUpdateStage();
  const isEditing = !!stage;

  const schema = yup.object({
    name: yup.string().required(t('pipelines.validation.stageNameRequired')),
    probability: yup
      .number()
      .typeError(t('pipelines.validation.probabilityNumber'))
      .min(0, t('pipelines.validation.probabilityRange'))
      .max(100, t('pipelines.validation.probabilityRange'))
      .optional(),
    isWon: yup.boolean().optional(),
    isLost: yup.boolean().optional(),
  });

  type StageFormValues = yup.InferType<typeof schema>;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StageFormValues>({
    resolver: yupResolver(schema),
    defaultValues: { name: '', probability: 0, isWon: false, isLost: false },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: stage?.name ?? '',
        probability: stage?.probability ?? 0,
        isWon: stage?.isWon ?? false,
        isLost: stage?.isLost ?? false,
      });
    }
  }, [open, stage, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (values: StageFormValues) => {
    if (isEditing && stage) {
      updateStage.mutate(
        { pipelineId, stageId: stage.id, payload: values },
        { onSuccess: handleClose },
      );
    } else {
      addStage.mutate({ pipelineId, payload: values }, { onSuccess: handleClose });
    }
  };

  const isPending = addStage.isPending || updateStage.isPending;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>{isEditing ? t('pipelines.stageForm.editTitle') : t('pipelines.stageForm.createTitle')}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
            <TextField
              label={t('pipelines.stageForm.probability')}
              type="number"
              fullWidth
              slotProps={{ htmlInput: { min: 0, max: 100 } }}
              {...register('probability')}
              error={!!errors.probability}
              helperText={errors.probability?.message}
            />
            <Stack direction="row" spacing={2}>
              <Controller
                name="isWon"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                    label={t('pipelines.stageForm.isWon')}
                  />
                )}
              />
              <Controller
                name="isLost"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                    label={t('pipelines.stageForm.isLost')}
                  />
                )}
              />
            </Stack>
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

export default StageFormDialog;
