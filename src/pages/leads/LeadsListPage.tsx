import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import PageHeader from '../../components/common/PageHeader';
import DataTable, { type DataTableColumn } from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import { useLeads } from '../../hooks/queries';
import type { Lead } from '../../types';
import LeadFormDialog from './LeadFormDialog';

function LeadsListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(25);
  const [formOpen, setFormOpen] = useState(false);

  const { data, isLoading, isError } = useLeads({ search: search || undefined, page: page + 1, limit });

  const columns: DataTableColumn<Lead>[] = [
    { key: 'name', header: 'Name', render: (r) => `${r.firstName} ${r.lastName}` },
    { key: 'company', header: 'Company', render: (r) => r.company ?? '—' },
    { key: 'email', header: 'Email', render: (r) => r.email ?? '—' },
    { key: 'phone', header: 'Phone', render: (r) => r.phone ?? '—' },
    { key: 'status', header: 'Status', render: (r) => <StatusChip status={r.status} /> },
  ];

  return (
    <Box>
      <PageHeader
        title="Leads"
        subtitle="Prospective customers not yet converted"
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFormOpen(true)}>
            New Lead
          </Button>
        }
      />

      <TextField
        placeholder="Search leads…"
        size="small"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(0);
        }}
        sx={{ mb: 2, width: 320 }}
      />

      <DataTable
        columns={columns}
        rows={data?.data ?? []}
        getRowId={(r) => r.id}
        isLoading={isLoading}
        isError={isError}
        onRowClick={(r) => navigate(`/app/leads/${r.id}`)}
        emptyMessage="No leads found."
        page={page}
        limit={limit}
        total={data?.total ?? 0}
        onPageChange={setPage}
        onLimitChange={(l) => {
          setLimit(l);
          setPage(0);
        }}
      />

      <LeadFormDialog open={formOpen} onClose={() => setFormOpen(false)} />
    </Box>
  );
}

export default LeadsListPage;
