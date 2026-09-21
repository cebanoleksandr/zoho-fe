import { useMemo, useState } from 'react';
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
import { useCreateDeal, usePipelines } from '../../hooks/queries';
import type { CreateDealPayload } from '../../types';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  amount: yup.number().typeError('Must be a number').optional(),
  currency: yup.string().optional(),
  accountId: yup.string().optional(),
  contactId: yup.string().optional(),
  pipelineId: yup.string().required('Pipeline is required'),
  stageId: yup.string().required('Stage is required'),
  ownerId: yup.string().optional(),
  expectedCloseDate: yup.string().optional(),
  description: yup.string().optional(),
});

type DealFormValues = yup.InferType<typeof schema>;

interface DealFormDialogProps {
  open: boolean;
  onClose: () => void;
}

function DealFormDialog({ open, onClose }: DealFormDialogProps) {
  const createDeal = useCreateDeal();
  const { data: pipelines } = usePipelines();
  const [selectedPipelineId, setSelectedPipelineId] = useState('');

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DealFormValues>({ resolver: yupResolver(schema) });

  const stages = useMemo(
    () => pipelines?.find((p) => p.id === selectedPipelineId)?.stages ?? [],
    [pipelines, selectedPipelineId],
  );

  const handleClose = () => {
    reset();
    setSelectedPipelineId('');
    onClose();
  };

  const onSubmit = (payload: DealFormValues) => {
    createDeal.mutate(payload as CreateDealPayload, { onSuccess: handleClose });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>New Deal</DialogTitle>
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
              <TextField label="Amount" type="number" fullWidth {...register('amount')} />
              <TextField label="Currency" fullWidth {...register('currency')} placeholder="USD" />
            </Stack>
            <Controller
              name="pipelineId"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  select
                  label="Pipeline"
                  fullWidth
                  {...field}
                  error={!!errors.pipelineId}
                  helperText={errors.pipelineId?.message}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    setSelectedPipelineId(e.target.value);
                  }}
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
                  label="Stage"
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
              label="Expected close date"
              type="date"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              {...register('expectedCloseDate')}
            />
            <TextField label="Description" fullWidth multiline minRows={2} {...register('description')} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={createDeal.isPending}>
            {createDeal.isPending ? 'Saving…' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default DealFormDialog;
