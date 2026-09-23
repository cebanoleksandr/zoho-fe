import { useTranslation } from 'react-i18next';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import { useWebhook, useWebhookDeliveries } from '../../hooks/queries';

interface WebhookDeliveriesDialogProps {
  webhookId: string | null;
  onClose: () => void;
}

function WebhookDeliveriesDialog({ webhookId, onClose }: WebhookDeliveriesDialogProps) {
  const { t } = useTranslation();
  const open = !!webhookId;
  const { data: webhook } = useWebhook(webhookId ?? '', open);
  const { data: deliveries, isLoading } = useWebhookDeliveries(webhookId ?? '', open);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('settings.webhooks.deliveries.title', { url: webhook?.url ?? '' })}</DialogTitle>
      <DialogContent>
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {!isLoading && (deliveries ?? []).length === 0 && (
          <Typography color="text.secondary">{t('settings.webhooks.deliveries.empty')}</Typography>
        )}

        {!isLoading &&
          (deliveries ?? []).map((d) => (
            <Box key={d.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1, borderBottom: '1px solid #e5e7eb' }}>
              <Chip
                size="small"
                label={d.success ? t('settings.webhooks.deliveries.success') : t('settings.webhooks.deliveries.failed')}
                color={d.success ? 'success' : 'error'}
              />
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {d.event}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {d.statusCode ?? '—'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(d.createdAt).toLocaleString()}
              </Typography>
            </Box>
          ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.close')}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default WebhookDeliveriesDialog;
