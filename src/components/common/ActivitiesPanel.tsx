import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import StatusChip from './StatusChip';
import { useActivities, useCompleteActivity, useDeleteActivity } from '../../hooks/queries';
import { ActivityStatus, type CrmEntityType } from '../../types';
import ActivityFormDialog from '../../pages/activities/ActivityFormDialog';

interface ActivitiesPanelProps {
  entityType: CrmEntityType;
  entityId: string;
}

function ActivitiesPanel({ entityType, entityId }: ActivitiesPanelProps) {
  const { t } = useTranslation();
  const [formOpen, setFormOpen] = useState(false);
  const { data: activities, isLoading } = useActivities({ entityType, entityId });
  const completeActivity = useCompleteActivity();
  const deleteActivity = useDeleteActivity();

  return (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid #e5e7eb', borderRadius: 2, mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {t('activities.title')}
        </Typography>
        <Button size="small" startIcon={<AddIcon />} onClick={() => setFormOpen(true)}>
          {t('activities.new')}
        </Button>
      </Box>

      <Stack spacing={1}>
        {!isLoading && (activities?.data ?? []).length === 0 && (
          <Typography variant="body2" color="text.secondary">
            {t('activities.empty')}
          </Typography>
        )}
        {activities?.data.map((a) => (
          <Box
            key={a.id}
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}
          >
            <Box>
              <Typography variant="body2">
                {a.type} — {a.subject}
              </Typography>
              {a.dueDate && (
                <Typography variant="caption" color="text.secondary">
                  {a.dueDate}
                </Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <StatusChip status={a.status} />
              {a.status === ActivityStatus.PENDING && (
                <Tooltip title={t('activities.markComplete')}>
                  <IconButton size="small" onClick={() => completeActivity.mutate(a.id)}>
                    <CheckCircleOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title={t('common.delete')}>
                <IconButton size="small" onClick={() => deleteActivity.mutate(a.id)}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        ))}
      </Stack>

      <ActivityFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        defaultEntityType={entityType}
        defaultEntityId={entityId}
      />
    </Paper>
  );
}

export default ActivitiesPanel;
