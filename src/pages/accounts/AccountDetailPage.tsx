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
import { useAccount, useDeleteAccount, useContacts, useDeals } from '../../hooks/queries';

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

function AccountDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: account, isLoading, isError } = useAccount(id);
  const { data: contacts } = useContacts({ accountId: id });
  const { data: deals } = useDeals({ accountId: id });
  const deleteAccount = useDeleteAccount();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !account) {
    return <Alert severity="error">Account not found.</Alert>;
  }

  return (
    <Box>
      <PageHeader
        title={account.name}
        subtitle={account.industry ?? undefined}
        actions={
          <Button variant="outlined" color="error" startIcon={<DeleteOutlineIcon />} onClick={() => setConfirmOpen(true)}>
            Delete
          </Button>
        }
      />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e5e7eb', borderRadius: 2 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 6 }}>
                <Field label="Website" value={account.website ?? '—'} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Field label="Phone" value={account.phone ?? '—'} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Field label="Billing address" value={account.billingAddress ?? '—'} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Field label="Description" value={account.description ?? '—'} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e5e7eb', borderRadius: 2, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Contacts ({contacts?.total ?? 0})
            </Typography>
            {(contacts?.data ?? []).slice(0, 5).map((c) => (
              <Typography key={c.id} variant="body2">
                {c.firstName} {c.lastName}
              </Typography>
            ))}
          </Paper>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e5e7eb', borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Deals ({deals?.total ?? 0})
            </Typography>
            {(deals?.data ?? []).slice(0, 5).map((d) => (
              <Typography key={d.id} variant="body2">
                {d.name}
              </Typography>
            ))}
          </Paper>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete account?"
        description="This action cannot be undone."
        loading={deleteAccount.isPending}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() =>
          deleteAccount.mutate(id, {
            onSuccess: () => navigate('/app/accounts'),
          })
        }
      />
    </Box>
  );
}

export default AccountDetailPage;
