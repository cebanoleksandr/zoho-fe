import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
import { useCreateContact, useUpdateContact } from '../../hooks/queries';
import type { Contact, CreateContactPayload } from '../../types';

interface ContactFormDialogProps {
  open: boolean;
  contact?: Contact | null;
  onClose: () => void;
}

function ContactFormDialog({ open, contact, onClose }: ContactFormDialogProps) {
  const { t } = useTranslation();
  const createContact = useCreateContact();
  const updateContact = useUpdateContact();
  const isEditing = !!contact;

  const schema = yup.object({
    firstName: yup.string().required(t('contacts.validation.firstNameRequired')),
    lastName: yup.string().required(t('contacts.validation.lastNameRequired')),
    email: yup.string().email(t('auth.validation.emailInvalid')).optional(),
    phone: yup.string().optional(),
    title: yup.string().optional(),
    accountId: yup.string().optional(),
    ownerId: yup.string().optional(),
    notes: yup.string().optional(),
  });

  type ContactFormValues = yup.InferType<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({ resolver: yupResolver(schema) });

  useEffect(() => {
    if (open) {
      reset({
        firstName: contact?.firstName ?? '',
        lastName: contact?.lastName ?? '',
        email: contact?.email ?? '',
        phone: contact?.phone ?? '',
        title: contact?.title ?? '',
        notes: contact?.notes ?? '',
      });
    }
  }, [open, contact, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (payload: ContactFormValues) => {
    if (isEditing && contact) {
      updateContact.mutate({ id: contact.id, payload }, { onSuccess: handleClose });
    } else {
      createContact.mutate(payload as CreateContactPayload, { onSuccess: handleClose });
    }
  };

  const isPending = createContact.isPending || updateContact.isPending;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? t('contacts.form.editTitle') : t('contacts.form.title')}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
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
            <TextField label={t('common.title')} fullWidth {...register('title')} />
            <TextField label={t('contacts.form.notes')} fullWidth multiline minRows={2} {...register('notes')} />
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

export default ContactFormDialog;
