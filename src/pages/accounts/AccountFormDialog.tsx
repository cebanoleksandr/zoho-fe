import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useCreateAccount } from '../../hooks/queries';
import type { CreateAccountPayload } from '../../types';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  industry: yup.string().optional(),
  website: yup.string().optional(),
  phone: yup.string().optional(),
  billingAddress: yup.string().optional(),
  description: yup.string().optional(),
  ownerId: yup.string().optional(),
});

type AccountFormValues = yup.InferType<typeof schema>;

interface AccountFormDialogProps {
  open: boolean;
  onClose: () => void;
}

function AccountFormDialog({ open, onClose }: AccountFormDialogProps) {
  const createAccount = useCreateAccount();
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
      <DialogTitle>New Account</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            <TextField
              label="Name"
              fullWidth
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <Stack direction="row" spacing={2}>
              <TextField label="Industry" fullWidth {...register('industry')} />
              <TextField label="Website" fullWidth {...register('website')} />
            </Stack>
            <TextField label="Phone" fullWidth {...register('phone')} />
            <TextField label="Billing address" fullWidth {...register('billingAddress')} />
            <TextField label="Description" fullWidth multiline minRows={2} {...register('description')} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={createAccount.isPending}>
            {createAccount.isPending ? 'Saving…' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default AccountFormDialog;
