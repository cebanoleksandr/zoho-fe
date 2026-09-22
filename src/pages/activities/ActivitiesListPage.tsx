import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PageHeader from '../../components/common/PageHeader';
import DataTable, { type DataTableColumn } from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useActivities, useCompleteActivity, useDeleteActivity } from '../../hooks/queries';
import { ActivityStatus, type Activity } from '../../types';
import ActivityFormDialog from './ActivityFormDialog';

function ActivitiesListPage() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<ActivityStatus | 'ALL'>('ALL');
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(25);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, isError } = useActivities({
    status: status === 'ALL' ? undefined : status,
    page: page + 1,
    limit,
  });
  const completeActivity = useCompleteActivity();
  const deleteActivity = useDeleteActivity();

  const columns: DataTableColumn<Activity>[] = [
    { key: 'subject', header: t('activities.columns.subject'), render: (r) => r.subject },
    { key: 'type', header: t('activities.columns.type'), render: (r) => r.type },
    {
      key: 'related',
      header: t('activities.columns.relatedTo'),
      render: (r) => `${r.entityType} · ${r.entityId.slice(0, 8)}`,
    },
    { key: 'dueDate', header: t('activities.columns.due'), render: (r) => r.dueDate ?? '—' },
    { key: 'status', header: t('activities.columns.status'), render: (r) => <StatusChip status={r.status} /> },
    {
      key: 'actions',
      header: '',
      width: 100,
      render: (r) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {r.status === ActivityStatus.PENDING && (
            <Tooltip title={t('activities.markComplete')}>
              <IconButton size="small" onClick={(e) => { e.stopPropagation(); completeActivity.mutate(r.id); }}>
                <CheckCircleOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title={t('common.delete')}>
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); setDeleteId(r.id); }}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title={t('activities.title')}
        subtitle={t('activities.subtitle')}
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFormOpen(true)}>
            {t('activities.new')}
          </Button>
        }
      />

      <Tabs
        value={status}
        onChange={(_e, v) => {
          setStatus(v);
          setPage(0);
        }}
        sx={{ mb: 2 }}
      >
        <Tab label={t('activities.tabs.all')} value="ALL" />
        <Tab label={t('activities.tabs.pending')} value={ActivityStatus.PENDING} />
        <Tab label={t('activities.tabs.completed')} value={ActivityStatus.COMPLETED} />
        <Tab label={t('activities.tabs.cancelled')} value={ActivityStatus.CANCELLED} />
      </Tabs>

      <DataTable
        columns={columns}
        rows={data?.data ?? []}
        getRowId={(r) => r.id}
        isLoading={isLoading}
        isError={isError}
        emptyMessage={t('activities.empty')}
        page={page}
        limit={limit}
        total={data?.total ?? 0}
        onPageChange={setPage}
        onLimitChange={(l) => {
          setLimit(l);
          setPage(0);
        }}
      />

      <ActivityFormDialog open={formOpen} onClose={() => setFormOpen(false)} />

      <ConfirmDialog
        open={!!deleteId}
        title={t('activities.deleteTitle')}
        description={t('common.cannotBeUndone')}
        loading={deleteActivity.isPending}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteActivity.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
        }}
      />
    </Box>
  );
}

export default ActivitiesListPage;
