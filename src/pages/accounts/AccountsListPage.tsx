import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import PageHeader from '../../components/common/PageHeader';
import DataTable, { type DataTableColumn } from '../../components/common/DataTable';
import { useAccounts } from '../../hooks/queries';
import type { Account } from '../../types';
import AccountFormDialog from './AccountFormDialog';

function AccountsListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(25);
  const [formOpen, setFormOpen] = useState(false);

  const { data, isLoading, isError } = useAccounts({ search: search || undefined, page: page + 1, limit });

  const columns: DataTableColumn<Account>[] = [
    { key: 'name', header: t('accounts.columns.name'), render: (r) => r.name },
    { key: 'industry', header: t('accounts.columns.industry'), render: (r) => r.industry ?? '—' },
    { key: 'website', header: t('accounts.columns.website'), render: (r) => r.website ?? '—' },
    { key: 'phone', header: t('accounts.columns.phone'), render: (r) => r.phone ?? '—' },
  ];

  return (
    <Box>
      <PageHeader
        title={t('accounts.title')}
        subtitle={t('accounts.subtitle')}
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFormOpen(true)}>
            {t('accounts.new')}
          </Button>
        }
      />

      <TextField
        placeholder={t('accounts.searchPlaceholder')}
        size="small"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(0);
        }}
        sx={{ mb: 2, width: { xs: '100%', sm: 320 } }}
      />

      <DataTable
        columns={columns}
        rows={data?.data ?? []}
        getRowId={(r) => r.id}
        isLoading={isLoading}
        isError={isError}
        onRowClick={(r) => navigate(`/app/accounts/${r.id}`)}
        emptyMessage={t('accounts.empty')}
        page={page}
        limit={limit}
        total={data?.total ?? 0}
        onPageChange={setPage}
        onLimitChange={(l) => {
          setLimit(l);
          setPage(0);
        }}
      />

      <AccountFormDialog open={formOpen} onClose={() => setFormOpen(false)} />
    </Box>
  );
}

export default AccountsListPage;
