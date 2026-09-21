import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import PageHeader from '../../components/common/PageHeader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StatusChip from '../../components/common/StatusChip';
import {
  useLead,
  useUpdateLeadStatus,
  useConvertLead,
  useDeleteLead,
  useActivities,
} from '../../hooks/queries';
import { LeadStatus } from '../../types';

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

function LeadDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: lead, isLoading, isError } = useLead(id);
  const updateStatus = useUpdateLeadStatus();
  const convertLead = useConvertLead();
  const deleteLead = useDeleteLead();
  const { data: activities } = useActivities({ entityType: 'LEAD', entityId: id });
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !lead) {
    return <Alert severity="error">Lead not found.</Alert>;
  }

  return (
    <Box>
      <PageHeader
        title={`${lead.firstName} ${lead.lastName}`}
        subtitle={lead.company ?? undefined}
        actions={
          <>
            {lead.status !== 'CONVERTED' && (
              <Button
                variant="outlined"
                startIcon={<SwapHorizIcon />}
                disabled={convertLead.isPending}
                onClick={() => convertLead.mutate({ id, payload: {} })}
              >
                Convert
              </Button>
            )}
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteOutlineIcon />}
              onClick={() => setConfirmOpen(true)}
            >
              Delete
            </Button>
          </>
        }
      />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e5e7eb', borderRadius: 2 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 6 }}>
                <Field label="Email" value={lead.email ?? '—'} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Field label="Phone" value={lead.phone ?? '—'} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Field label="Title" value={lead.title ?? '—'} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Field label="Source" value={lead.source ?? '—'} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Field label="Notes" value={lead.notes ?? '—'} />
              </Grid>
            </Grid>
          </Paper>

          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e5e7eb', borderRadius: 2, mt: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
              Activities
            </Typography>
            <Stack spacing={1}>
              {(activities?.data ?? []).length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No activities logged yet.
                </Typography>
              )}
              {activities?.data.map((a) => (
                <Box key={a.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                  <Typography variant="body2">
                    {a.type} — {a.subject}
                  </Typography>
                  <StatusChip status={a.status} />
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e5e7eb', borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Status
            </Typography>
            <Select
              fullWidth
              size="small"
              value={lead.status}
              disabled={updateStatus.isPending}
              onChange={(e) => updateStatus.mutate({ id, payload: { status: e.target.value as typeof lead.status } })}
              sx={{ mt: 0.5 }}
            >
              {Object.values(LeadStatus).map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </Paper>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete lead?"
        description="This action cannot be undone."
        loading={deleteLead.isPending}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() =>
          deleteLead.mutate(id, {
            onSuccess: () => navigate('/app/leads'),
          })
        }
      />
    </Box>
  );
}

export default LeadDetailPage;
