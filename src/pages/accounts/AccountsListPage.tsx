import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(25);
  const [formOpen, setFormOpen] = useState(false);

  const { data, isLoading, isError } = useAccounts({ search: search || undefined, page: page + 1, limit });

  const columns: DataTableColumn<Account>[] = [
    { key: 'name', header: 'Name', render: (r) => r.name },
    { key: 'industry', header: 'Industry', render: (r) => r.industry ?? '—' },
    { key: 'website', header: 'Website', render: (r) => r.website ?? '—' },
    { key: 'phone', header: 'Phone', render: (r) => r.phone ?? '—' },
  ];

  return (
    <Box>
      <PageHeader
        title="Accounts"
        subtitle="Companies you do business with"
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFormOpen(true)}>
            New Account
          </Button>
        }
      />

      <TextField
        placeholder="Search accounts…"
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
        onRowClick={(r) => navigate(`/app/accounts/${r.id}`)}
        emptyMessage="No accounts found."
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
