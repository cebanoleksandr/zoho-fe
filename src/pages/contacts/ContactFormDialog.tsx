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
import { useCreateContact } from '../../hooks/queries';
import type { CreateContactPayload } from '../../types';

const schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').optional(),
  phone: yup.string().optional(),
  title: yup.string().optional(),
  accountId: yup.string().optional(),
  ownerId: yup.string().optional(),
  notes: yup.string().optional(),
});

type ContactFormValues = yup.InferType<typeof schema>;

interface ContactFormDialogProps {
  open: boolean;
  onClose: () => void;
}

function ContactFormDialog({ open, onClose }: ContactFormDialogProps) {
  const createContact = useCreateContact();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({ resolver: yupResolver(schema) });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (payload: ContactFormValues) => {
    createContact.mutate(payload as CreateContactPayload, { onSuccess: handleClose });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>New Contact</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            <Stack direction="row" spacing={2}>
              <TextField
                label="First name"
                fullWidth
                {...register('firstName')}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
              <TextField
                label="Last name"
                fullWidth
                {...register('lastName')}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            </Stack>
            <TextField label="Email" fullWidth {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
            <TextField label="Phone" fullWidth {...register('phone')} />
            <TextField label="Title" fullWidth {...register('title')} />
            <TextField label="Notes" fullWidth multiline minRows={2} {...register('notes')} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={createContact.isPending}>
            {createContact.isPending ? 'Saving…' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default ContactFormDialog;
