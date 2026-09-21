import { useMemo, useState } from 'react';
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

// The backend doesn't support a `search` query param for /leads, so when the
// user types something we fetch a larger batch and filter it client-side
// instead of paginating server-side.
const SEARCH_BATCH_SIZE = 100;

function LeadsListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(25);
  const [formOpen, setFormOpen] = useState(false);

  const isSearching = search.trim().length > 0;

  const { data, isLoading, isError } = useLeads(
    isSearching ? { limit: SEARCH_BATCH_SIZE } : { page: page + 1, limit },
  );

  const rows = useMemo(() => {
    const all = data?.data ?? [];
    if (!isSearching) return all;
    const query = search.trim().toLowerCase();
    return all.filter((r) =>
      [r.firstName, r.lastName, r.company, r.email]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(query)),
    );
  }, [data, isSearching, search]);

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
        rows={rows}
        getRowId={(r) => r.id}
        isLoading={isLoading}
        isError={isError}
        onRowClick={(r) => navigate(`/app/leads/${r.id}`)}
        emptyMessage={t('leads.empty')}
        {...(isSearching
          ? {}
          : {
              page,
              limit,
              total: data?.total ?? 0,
              onPageChange: setPage,
              onLimitChange: (l: number) => {
                setLimit(l);
                setPage(0);
              },
            })}
      />

      <LeadFormDialog open={formOpen} onClose={() => setFormOpen(false)} />
    </Box>
  );
}

export default LeadsListPage;
