import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PageHeader from '../../components/common/PageHeader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ActivitiesPanel from '../../components/common/ActivitiesPanel';
import CustomFieldsSection from '../../components/common/CustomFieldsSection';
import InlineEditField from '../../components/common/InlineEditField';
import {
  useDeal,
  useUpdateDeal,
  useDeleteDeal,
  useUpdateDealStage,
  usePipeline,
  useContact,
  useContacts,
  useUser,
} from '../../hooks/queries';
import { CrmEntityType, type UpdateDealPayload } from '../../types';

function formatDate(value: string | null) {
  return value ? new Date(value).toLocaleDateString() : '—';
}

function DealDetailPage() {
  const { t } = useTranslation();
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: deal, isLoading, isError } = useDeal(id);
  const { data: pipeline } = usePipeline(deal?.pipelineId ?? '', !!deal?.pipelineId);
  const { data: contact } = useContact(deal?.contactId ?? '', !!deal?.contactId);
  const { data: contacts } = useContacts();
  const { data: owner } = useUser(deal?.ownerId ?? '', !!deal?.ownerId);
  const updateDeal = useUpdateDeal();
  const updateStage = useUpdateDealStage();
  const deleteDeal = useDeleteDeal();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const saveField = (field: keyof UpdateDealPayload) => (value: string) => {
    const payload = field === 'amount' ? { [field]: value === '' ? undefined : Number(value) } : { [field]: value };
    updateDeal.mutate({ id, payload: payload as UpdateDealPayload });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !deal) {
    return <Alert severity="error">{t('deals.detail.notFound')}</Alert>;
  }

  return (
    <Box>
      <PageHeader
        title={deal.name}
        subtitle={deal.amount != null ? `${deal.amount} ${deal.currency ?? ''}`.trim() : undefined}
        actions={
          <Button variant="outlined" color="error" startIcon={<DeleteOutlineIcon />} onClick={() => setConfirmOpen(true)}>
            {t('common.delete')}
          </Button>
        }
      />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e5e7eb', borderRadius: 2 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <InlineEditField label={t('common.name')} value={deal.name} onSave={saveField('name')} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <InlineEditField
                  label={t('deals.form.amount')}
                  type="number"
                  value={deal.amount != null ? String(deal.amount) : ''}
                  onSave={saveField('amount')}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <InlineEditField label={t('deals.form.currency')} value={deal.currency ?? ''} onSave={saveField('currency')} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <InlineEditField
                  label={t('deals.form.expectedCloseDate')}
                  type="date"
                  value={deal.expectedCloseDate ?? ''}
                  onSave={saveField('expectedCloseDate')}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {t('deals.detail.closedAt')}
                  </Typography>
                  <Typography variant="body2">{formatDate(deal.closedAt)}</Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <InlineEditField
                  label={t('deals.detail.dealWith')}
                  value={deal.contactId ?? ''}
                  onSave={saveField('contactId')}
                  options={[
                    ...(contact && !(contacts?.data ?? []).some((c) => c.id === contact.id)
                      ? [{ value: contact.id, label: `${contact.firstName} ${contact.lastName}` }]
                      : []),
                    ...(contacts?.data ?? []).map((c) => ({ value: c.id, label: `${c.firstName} ${c.lastName}` })),
                  ]}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {t('common.owner')}
                  </Typography>
                  <Typography variant="body2">{owner ? `${owner.firstName} ${owner.lastName}` : '—'}</Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <InlineEditField
                  label={t('common.description')}
                  value={deal.description ?? ''}
                  onSave={saveField('description')}
                  multiline
                />
              </Grid>
            </Grid>
          </Paper>

          <CustomFieldsSection entityType={CrmEntityType.DEAL} entityId={id} />

          <ActivitiesPanel entityType={CrmEntityType.DEAL} entityId={id} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e5e7eb', borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary">
              {t('deals.detail.stageOf', { pipeline: pipeline?.name ?? '—' })}
            </Typography>
            <Select
              fullWidth
              size="small"
              value={deal.stageId}
              disabled={updateStage.isPending}
              onChange={(e) => updateStage.mutate({ id, payload: { stageId: e.target.value } })}
              sx={{ mt: 0.5 }}
            >
              {(pipeline?.stages ?? []).map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
          </Paper>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={confirmOpen}
        title={t('deals.detail.deleteTitle')}
        description={t('common.cannotBeUndone')}
        loading={deleteDeal.isPending}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() =>
          deleteDeal.mutate(id, {
            onSuccess: () => navigate('/app/deals'),
          })
        }
      />
    </Box>
  );
}

export default DealDetailPage;
