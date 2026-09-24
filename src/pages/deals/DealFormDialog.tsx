import { useEffect, useMemo } from 'react';
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
import { useCreateDeal, useUpdateDeal, usePipelines, useContacts } from '../../hooks/queries';
import type { CreateDealPayload, Deal } from '../../types';

interface DealFormDialogProps {
  open: boolean;
  deal?: Deal | null;
  onClose: () => void;
}

function DealFormDialog({ open, deal, onClose }: DealFormDialogProps) {
  const { t } = useTranslation();
  const createDeal = useCreateDeal();
  const updateDeal = useUpdateDeal();
  const { data: pipelines } = usePipelines();
  const { data: contacts } = useContacts();
  const isEditing = !!deal;

  const schema = yup.object({
    name: yup.string().required(t('deals.validation.nameRequired')),
    amount: yup.number().typeError(t('deals.validation.amountNumber')).optional(),
    currency: yup.string().optional(),
    accountId: yup.string().optional(),
    contactId: yup.string().optional(),
    pipelineId: yup.string().required(t('deals.validation.pipelineRequired')),
    stageId: yup.string().required(t('deals.validation.stageRequired')),
    ownerId: yup.string().optional(),
    expectedCloseDate: yup.string().optional(),
    description: yup.string().optional(),
  });

  type DealFormValues = yup.InferType<typeof schema>;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DealFormValues>({ resolver: yupResolver(schema) });

  const selectedPipelineId = useWatch({ control, name: 'pipelineId' });

  const stages = useMemo(
    () => pipelines?.find((p) => p.id === selectedPipelineId)?.stages ?? [],
    [pipelines, selectedPipelineId],
  );

  useEffect(() => {
    if (open) {
      reset({
        name: deal?.name ?? '',
        amount: deal?.amount ?? undefined,
        currency: deal?.currency ?? '',
        contactId: deal?.contactId ?? '',
        pipelineId: deal?.pipelineId ?? '',
        stageId: deal?.stageId ?? '',
        expectedCloseDate: deal?.expectedCloseDate ?? '',
        description: deal?.description ?? '',
      });
    }
  }, [open, deal, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (payload: DealFormValues) => {
    if (isEditing && deal) {
      updateDeal.mutate({ id: deal.id, payload }, { onSuccess: handleClose });
    } else {
      createDeal.mutate(payload as CreateDealPayload, { onSuccess: handleClose });
    }
  };

  const isPending = createDeal.isPending || updateDeal.isPending;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? t('deals.form.editTitle') : t('deals.form.title')}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            <TextField
              label={t('common.name')}
              fullWidth
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label={t('deals.form.amount')} type="number" fullWidth {...register('amount')} />
              <TextField label={t('deals.form.currency')} fullWidth {...register('currency')} placeholder="USD" />
            </Stack>
            <Controller
              name="contactId"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField select label={t('deals.form.contact')} fullWidth {...field}>
                  <MenuItem value="">—</MenuItem>
                  {(contacts?.data ?? []).map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.firstName} {c.lastName}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              name="pipelineId"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  select
                  label={t('deals.form.pipeline')}
                  fullWidth
                  {...field}
                  error={!!errors.pipelineId}
                  helperText={errors.pipelineId?.message}
                >
                  {(pipelines ?? []).map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              name="stageId"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  select
                  label={t('deals.form.stage')}
                  fullWidth
                  disabled={!selectedPipelineId}
                  {...field}
                  error={!!errors.stageId}
                  helperText={errors.stageId?.message}
                >
                  {stages.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <TextField
              label={t('deals.form.expectedCloseDate')}
              type="date"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              {...register('expectedCloseDate')}
            />
            <TextField label={t('common.description')} fullWidth multiline minRows={2} {...register('description')} />
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

export default DealFormDialog;
