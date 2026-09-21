import { useState } from 'react';
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
import { useActivities, useCompleteActivity, useDeleteActivity } from '../../hooks/queries';
import type { Activity, ActivityStatus } from '../../types';
import ActivityFormDialog from './ActivityFormDialog';

function ActivitiesListPage() {
  const [status, setStatus] = useState<ActivityStatus | 'ALL'>('ALL');
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(25);
  const [formOpen, setFormOpen] = useState(false);

  const { data, isLoading, isError } = useActivities({
    status: status === 'ALL' ? undefined : status,
    page: page + 1,
    limit,
  });
  const completeActivity = useCompleteActivity();
  const deleteActivity = useDeleteActivity();

  const columns: DataTableColumn<Activity>[] = [
    { key: 'subject', header: 'Subject', render: (r) => r.subject },
    { key: 'type', header: 'Type', render: (r) => r.type },
    { key: 'related', header: 'Related To', render: (r) => `${r.entityType} · ${r.entityId.slice(0, 8)}` },
    { key: 'dueDate', header: 'Due', render: (r) => r.dueDate ?? '—' },
    { key: 'status', header: 'Status', render: (r) => <StatusChip status={r.status} /> },
    {
      key: 'actions',
      header: '',
      width: 100,
      render: (r) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {r.status !== 'COMPLETED' && (
            <Tooltip title="Mark complete">
              <IconButton size="small" onClick={(e) => { e.stopPropagation(); completeActivity.mutate(r.id); }}>
                <CheckCircleOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Delete">
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); deleteActivity.mutate(r.id); }}>
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
        title="Activities"
        subtitle="Calls, meetings, tasks, emails and notes"
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFormOpen(true)}>
            New Activity
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
        <Tab label="All" value="ALL" />
        <Tab label="Pending" value="PENDING" />
        <Tab label="Completed" value="COMPLETED" />
      </Tabs>

      <DataTable
        columns={columns}
        rows={data?.data ?? []}
        getRowId={(r) => r.id}
        isLoading={isLoading}
        isError={isError}
        emptyMessage="No activities found."
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
    </Box>
  );
}

export default ActivitiesListPage;
