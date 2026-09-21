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
import { useCreateLead } from '../../hooks/queries';
import { LeadSource, LeadStatus, type CreateLeadPayload } from '../../types';

const schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').optional(),
  phone: yup.string().optional(),
  company: yup.string().optional(),
  title: yup.string().optional(),
  source: yup.mixed<LeadSource>().oneOf(Object.values(LeadSource)).optional(),
  status: yup.mixed<LeadStatus>().oneOf(Object.values(LeadStatus)).optional(),
  ownerId: yup.string().optional(),
  notes: yup.string().optional(),
});

type LeadFormValues = yup.InferType<typeof schema>;

interface LeadFormDialogProps {
  open: boolean;
  onClose: () => void;
}

function LeadFormDialog({ open, onClose }: LeadFormDialogProps) {
  const createLead = useCreateLead();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({ resolver: yupResolver(schema) });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (payload: LeadFormValues) => {
    createLead.mutate(payload as CreateLeadPayload, { onSuccess: handleClose });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>New Lead</DialogTitle>
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
            <Stack direction="row" spacing={2}>
              <TextField label="Company" fullWidth {...register('company')} />
              <TextField label="Title" fullWidth {...register('title')} />
            </Stack>
            <Controller
              name="source"
              control={control}
              defaultValue={undefined}
              render={({ field }) => (
                <TextField select label="Source" fullWidth {...field} value={field.value ?? ''}>
                  <MenuItem value="">—</MenuItem>
                  {Object.values(LeadSource).map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <TextField label="Notes" fullWidth multiline minRows={2} {...register('notes')} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={createLead.isPending}>
            {createLead.isPending ? 'Saving…' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default LeadFormDialog;
