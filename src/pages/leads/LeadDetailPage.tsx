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
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import PageHeader from '../../components/common/PageHeader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ActivitiesPanel from '../../components/common/ActivitiesPanel';
import CustomFieldsSection from '../../components/common/CustomFieldsSection';
import InlineEditField from '../../components/common/InlineEditField';
import {
  useLead,
  useUpdateLead,
  useUpdateLeadStatus,
  useConvertLead,
  useDeleteLead,
  useUser,
} from '../../hooks/queries';
import { CrmEntityType, LeadSource, LeadStatus, type UpdateLeadPayload } from '../../types';

function LeadDetailPage() {
  const { t } = useTranslation();
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: lead, isLoading, isError } = useLead(id);
  const { data: owner } = useUser(lead?.ownerId ?? '', !!lead?.ownerId);
  const updateLead = useUpdateLead();
  const updateStatus = useUpdateLeadStatus();
  const convertLead = useConvertLead();
  const deleteLead = useDeleteLead();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [convertConfirmOpen, setConvertConfirmOpen] = useState(false);

  const saveField = (field: keyof UpdateLeadPayload) => (value: string) => {
    updateLead.mutate({ id, payload: { [field]: value } as UpdateLeadPayload });
  };

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
                <InlineEditField label={t('auth.firstName')} value={lead.firstName} onSave={saveField('firstName')} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <InlineEditField label={t('auth.lastName')} value={lead.lastName} onSave={saveField('lastName')} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <InlineEditField label={t('leads.form.company')} value={lead.company ?? ''} onSave={saveField('company')} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <InlineEditField label={t('common.email')} value={lead.email ?? ''} onSave={saveField('email')} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <InlineEditField label={t('common.phone')} value={lead.phone ?? ''} onSave={saveField('phone')} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <InlineEditField label={t('common.title')} value={lead.title ?? ''} onSave={saveField('title')} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <InlineEditField
                  label={t('leads.detail.source')}
                  value={lead.source ?? ''}
                  onSave={saveField('source')}
                  options={Object.values(LeadSource).map((s) => ({ value: s, label: s }))}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {t('common.owner')}
                  </Typography>
                  <Typography variant="body2">{owner ? `${owner.firstName} ${owner.lastName}` : '—'}</Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <InlineEditField
                  label={t('leads.detail.notes')}
                  value={lead.notes ?? ''}
                  onSave={saveField('notes')}
                  multiline
                />
              </Grid>
            </Grid>
          </Paper>

          <CustomFieldsSection entityType={CrmEntityType.LEAD} entityId={id} />

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
