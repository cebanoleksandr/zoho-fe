import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(25);
  const [formOpen, setFormOpen] = useState(false);

  const { data, isLoading, isError } = useLeads({ search: search || undefined, page: page + 1, limit });

  const columns: DataTableColumn<Lead>[] = [
    { key: 'name', header: t('leads.columns.name'), render: (r) => `${r.firstName} ${r.lastName}` },
    { key: 'company', header: t('leads.columns.company'), render: (r) => r.company ?? '—' },
    { key: 'email', header: t('leads.columns.email'), render: (r) => r.email ?? '—' },
    { key: 'phone', header: t('leads.columns.phone'), render: (r) => r.phone ?? '—' },
    { key: 'status', header: t('leads.columns.status'), render: (r) => <StatusChip status={r.status} /> },
  ];

  return (
    <Box>
      <PageHeader
        title={t('leads.title')}
        subtitle={t('leads.subtitle')}
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFormOpen(true)}>
            {t('leads.new')}
          </Button>
        }
      />

      <TextField
        placeholder={t('leads.searchPlaceholder')}
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
        emptyMessage={t('leads.empty')}
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
