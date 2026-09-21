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
import MenuItem from '@mui/material/MenuItem';
import { useCreateLead, useUpdateLead } from '../../hooks/queries';
import { LeadSource, LeadStatus, type CreateLeadPayload, type Lead } from '../../types';

interface LeadFormDialogProps {
  open: boolean;
  lead?: Lead | null;
  onClose: () => void;
}

function LeadFormDialog({ open, lead, onClose }: LeadFormDialogProps) {
  const { t } = useTranslation();
  const createLead = useCreateLead();
  const updateLead = useUpdateLead();
  const isEditing = !!lead;

  const schema = yup.object({
    firstName: yup.string().required(t('leads.validation.firstNameRequired')),
    lastName: yup.string().required(t('leads.validation.lastNameRequired')),
    email: yup.string().email(t('auth.validation.emailInvalid')).optional(),
    phone: yup.string().optional(),
    company: yup.string().optional(),
    title: yup.string().optional(),
    source: yup.mixed<LeadSource>().oneOf(Object.values(LeadSource)).optional(),
    status: yup.mixed<LeadStatus>().oneOf(Object.values(LeadStatus)).optional(),
    ownerId: yup.string().optional(),
    notes: yup.string().optional(),
  });

  type LeadFormValues = yup.InferType<typeof schema>;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({ resolver: yupResolver(schema) });

  useEffect(() => {
    if (open) {
      reset({
        firstName: lead?.firstName ?? '',
        lastName: lead?.lastName ?? '',
        email: lead?.email ?? '',
        phone: lead?.phone ?? '',
        company: lead?.company ?? '',
        title: lead?.title ?? '',
        source: lead?.source ?? undefined,
        notes: lead?.notes ?? '',
      });
    }
  }, [open, lead, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (payload: LeadFormValues) => {
    if (isEditing && lead) {
      updateLead.mutate({ id: lead.id, payload }, { onSuccess: handleClose });
    } else {
      createLead.mutate(payload as CreateLeadPayload, { onSuccess: handleClose });
    }
  };

  const isPending = createLead.isPending || updateLead.isPending;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? t('leads.form.editTitle') : t('leads.form.title')}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            <Stack direction="row" spacing={2}>
              <TextField
                label={t('auth.firstName')}
                fullWidth
                {...register('firstName')}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
              <TextField
                label={t('auth.lastName')}
                fullWidth
                {...register('lastName')}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            </Stack>
            <TextField
              label={t('common.email')}
              fullWidth
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField label={t('common.phone')} fullWidth {...register('phone')} />
            <Stack direction="row" spacing={2}>
              <TextField label={t('leads.form.company')} fullWidth {...register('company')} />
              <TextField label={t('common.title')} fullWidth {...register('title')} />
            </Stack>
            <Controller
              name="source"
              control={control}
              defaultValue={undefined}
              render={({ field }) => (
                <TextField select label={t('leads.form.source')} fullWidth {...field} value={field.value ?? ''}>
                  <MenuItem value="">—</MenuItem>
                  {Object.values(LeadSource).map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <TextField label={t('leads.form.notes')} fullWidth multiline minRows={2} {...register('notes')} />
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

export default LeadFormDialog;
