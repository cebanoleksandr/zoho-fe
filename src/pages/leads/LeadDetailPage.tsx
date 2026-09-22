import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import PageHeader from '../../components/common/PageHeader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ActivitiesPanel from '../../components/common/ActivitiesPanel';
import {
  useLead,
  useUpdateLeadStatus,
  useConvertLead,
  useDeleteLead,
} from '../../hooks/queries';
import { CrmEntityType, LeadStatus } from '../../types';
import LeadFormDialog from './LeadFormDialog';

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
  const { t } = useTranslation();
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: lead, isLoading, isError } = useLead(id);
  const updateStatus = useUpdateLeadStatus();
  const convertLead = useConvertLead();
  const deleteLead = useDeleteLead();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [convertConfirmOpen, setConvertConfirmOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !lead) {
    return <Alert severity="error">{t('leads.detail.notFound')}</Alert>;
  }

  return (
    <Box>
      <PageHeader
        title={`${lead.firstName} ${lead.lastName}`}
        subtitle={lead.company ?? undefined}
        actions={
          <>
            {lead.status !== LeadStatus.CONVERTED && (
              <Button
                variant="outlined"
                startIcon={<SwapHorizIcon />}
                disabled={convertLead.isPending}
                onClick={() => setConvertConfirmOpen(true)}
              >
                {t('leads.detail.convert')}
              </Button>
            )}
            <Button variant="outlined" startIcon={<EditOutlinedIcon />} onClick={() => setEditOpen(true)}>
              {t('common.edit')}
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteOutlineIcon />}
              onClick={() => setConfirmOpen(true)}
            >
              {t('common.delete')}
            </Button>
          </>
        }
      />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e5e7eb', borderRadius: 2 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 6 }}>
                <Field label={t('common.email')} value={lead.email ?? '—'} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Field label={t('common.phone')} value={lead.phone ?? '—'} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Field label={t('common.title')} value={lead.title ?? '—'} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Field label={t('leads.detail.source')} value={lead.source ?? '—'} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Field label={t('leads.detail.notes')} value={lead.notes ?? '—'} />
              </Grid>
            </Grid>
          </Paper>

          <ActivitiesPanel entityType={CrmEntityType.LEAD} entityId={id} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e5e7eb', borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary">
              {t('leads.detail.status')}
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

      <LeadFormDialog open={editOpen} lead={lead} onClose={() => setEditOpen(false)} />

      <ConfirmDialog
        open={confirmOpen}
        title={t('leads.detail.deleteTitle')}
        description={t('common.cannotBeUndone')}
        loading={deleteLead.isPending}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() =>
          deleteLead.mutate(id, {
            onSuccess: () => navigate('/app/leads'),
          })
        }
      />

      <ConfirmDialog
        open={convertConfirmOpen}
        title={t('leads.detail.convertTitle')}
        description={t('leads.detail.convertDescription')}
        confirmLabel={t('leads.detail.convert')}
        loading={convertLead.isPending}
        onClose={() => setConvertConfirmOpen(false)}
        onConfirm={() =>
          convertLead.mutate(
            { id, payload: {} },
            { onSuccess: () => setConvertConfirmOpen(false) },
          )
        }
      />
    </Box>
  );
}

export default LeadDetailPage;
