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
import { useCreateAccount } from '../../hooks/queries';
import type { CreateAccountPayload } from '../../types';

interface AccountFormDialogProps {
  open: boolean;
  onClose: () => void;
}

function AccountFormDialog({ open, onClose }: AccountFormDialogProps) {
  const { t } = useTranslation();
  const createAccount = useCreateAccount();

  const schema = yup.object({
    name: yup.string().required(t('accounts.validation.nameRequired')),
    industry: yup.string().optional(),
    website: yup.string().optional(),
    phone: yup.string().optional(),
    billingAddress: yup.string().optional(),
    description: yup.string().optional(),
    ownerId: yup.string().optional(),
  });

  type AccountFormValues = yup.InferType<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AccountFormValues>({ resolver: yupResolver(schema) });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (payload: AccountFormValues) => {
    createAccount.mutate(payload as CreateAccountPayload, { onSuccess: handleClose });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('accounts.form.title')}</DialogTitle>
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
            <Stack direction="row" spacing={2}>
              <TextField label={t('accounts.form.industry')} fullWidth {...register('industry')} />
              <TextField label={t('accounts.form.website')} fullWidth {...register('website')} />
            </Stack>
            <TextField label={t('common.phone')} fullWidth {...register('phone')} />
            <TextField label={t('accounts.form.billingAddress')} fullWidth {...register('billingAddress')} />
            <TextField label={t('common.description')} fullWidth multiline minRows={2} {...register('description')} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('common.cancel')}</Button>
          <Button type="submit" variant="contained" disabled={createAccount.isPending}>
            {createAccount.isPending ? t('common.saving') : t('common.create')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default AccountFormDialog;
