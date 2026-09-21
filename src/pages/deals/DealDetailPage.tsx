import { useMemo, useState } from 'react';
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
import { useDeal, useDeleteDeal, useUpdateDealStage, usePipelines } from '../../hooks/queries';

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

function DealDetailPage() {
  const { t } = useTranslation();
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: deal, isLoading, isError } = useDeal(id);
  const { data: pipelines } = usePipelines();
  const updateStage = useUpdateDealStage();
  const deleteDeal = useDeleteDeal();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const pipeline = useMemo(() => pipelines?.find((p) => p.id === deal?.pipelineId), [pipelines, deal]);

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
              <Grid size={{ xs: 6 }}>
                <Field label={t('deals.detail.expectedCloseDate')} value={deal.expectedCloseDate ?? '—'} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Field label={t('deals.detail.closedAt')} value={deal.closedAt ?? '—'} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Field label={t('deals.detail.description')} value={deal.description ?? '—'} />
              </Grid>
            </Grid>
          </Paper>
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
