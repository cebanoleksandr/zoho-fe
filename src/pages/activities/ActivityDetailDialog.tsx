import { useTranslation } from 'react-i18next';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import StatusChip from '../../components/common/StatusChip';
import { useActivity, useUser } from '../../hooks/queries';

interface ActivityDetailDialogProps {
  activityId: string | null;
  onClose: () => void;
}

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

function ActivityDetailDialog({ activityId, onClose }: ActivityDetailDialogProps) {
  const { t } = useTranslation();
  const open = !!activityId;
  const { data: activity, isLoading } = useActivity(activityId ?? '', open);
  const { data: owner } = useUser(activity?.ownerId ?? '', !!activity?.ownerId);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{activity?.subject ?? t('activities.detail.title')}</DialogTitle>
      <DialogContent>
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {!isLoading && activity && (
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 6 }}>
              <Field label={t('activities.columns.type')} value={activity.type} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                {t('activities.columns.status')}
              </Typography>
              <StatusChip status={activity.status} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Field
                label={t('activities.columns.due')}
                value={activity.dueDate ? new Date(activity.dueDate).toLocaleDateString() : '—'}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Field label={t('common.owner')} value={owner ? `${owner.firstName} ${owner.lastName}` : '—'} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Field
                label={t('activities.columns.relatedTo')}
                value={`${activity.entityType} · ${activity.entityId.slice(0, 8)}`}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Field label={t('common.description')} value={activity.description ?? '—'} />
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.close')}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ActivityDetailDialog;
