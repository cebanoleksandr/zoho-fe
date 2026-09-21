import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/Add';
import PageHeader from '../../components/common/PageHeader';
import DataTable, { type DataTableColumn } from '../../components/common/DataTable';
import { useDeals, usePipelines } from '../../hooks/queries';
import type { Deal } from '../../types';
import DealFormDialog from './DealFormDialog';

// The backend doesn't support a `search` query param for /deals, so when the
// user types something we fetch a larger batch and filter it client-side
// instead of paginating server-side.
const SEARCH_BATCH_SIZE = 100;

function DealsListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(25);
  const [formOpen, setFormOpen] = useState(false);

  const isSearching = search.trim().length > 0;

  const { data, isLoading, isError } = useDeals(
    isSearching ? { limit: SEARCH_BATCH_SIZE } : { page: page + 1, limit },
  );
  const { data: pipelines } = usePipelines();

  const rows = useMemo(() => {
    const all = data?.data ?? [];
    if (!isSearching) return all;
    const query = search.trim().toLowerCase();
    return all.filter((r) => r.name.toLowerCase().includes(query));
  }, [data, isSearching, search]);

  const stageName = (row: Deal) => {
    const pipeline = pipelines?.find((p) => p.id === row.pipelineId);
    return pipeline?.stages.find((s) => s.id === row.stageId)?.name ?? '—';
  };

  const columns: DataTableColumn<Deal>[] = [
    { key: 'name', header: t('deals.columns.name'), render: (r) => r.name },
    {
      key: 'amount',
      header: t('deals.columns.amount'),
      render: (r) => (r.amount != null ? `${r.amount} ${r.currency ?? ''}`.trim() : '—'),
    },
    { key: 'stage', header: t('deals.columns.stage'), render: (r) => <Chip size="small" label={stageName(r)} /> },
    { key: 'closeDate', header: t('deals.columns.expectedClose'), render: (r) => r.expectedCloseDate ?? '—' },
  ];

  return (
    <Box>
      <PageHeader
        title={t('deals.title')}
        subtitle={t('deals.subtitle')}
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFormOpen(true)}>
            {t('deals.new')}
          </Button>
        }
      />

      <TextField
        placeholder={t('deals.searchPlaceholder')}
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
        onRowClick={(r) => navigate(`/app/deals/${r.id}`)}
        emptyMessage={t('deals.empty')}
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

      <DealFormDialog open={formOpen} onClose={() => setFormOpen(false)} />
    </Box>
  );
}

export default DealsListPage;
