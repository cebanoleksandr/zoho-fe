import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PageHeader from '../../components/common/PageHeader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useContact, useDeleteContact } from '../../hooks/queries';

function Field({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Box>
  );
}

function ContactDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: contact, isLoading, isError } = useContact(id);
  const deleteContact = useDeleteContact();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !contact) {
    return <Alert severity="error">Contact not found.</Alert>;
  }

  return (
    <Box>
      <PageHeader
        title={`${contact.firstName} ${contact.lastName}`}
        subtitle={contact.title ?? undefined}
        actions={
          <Button variant="outlined" color="error" startIcon={<DeleteOutlineIcon />} onClick={() => setConfirmOpen(true)}>
            Delete
          </Button>
        }
      />

      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e5e7eb', borderRadius: 2 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 6 }}>
            <Field label="Email" value={contact.email ?? '—'} />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Field label="Phone" value={contact.phone ?? '—'} />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Field label="Account" value={contact.accountId ?? '—'} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Field label="Notes" value={contact.notes ?? '—'} />
          </Grid>
        </Grid>
      </Paper>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete contact?"
        description="This action cannot be undone."
        loading={deleteContact.isPending}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() =>
          deleteContact.mutate(id, {
            onSuccess: () => navigate('/app/contacts'),
          })
        }
      />
    </Box>
  );
}

export default ContactDetailPage;
