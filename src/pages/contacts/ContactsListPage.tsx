import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import PageHeader from '../../components/common/PageHeader';
import DataTable, { type DataTableColumn } from '../../components/common/DataTable';
import { useContacts } from '../../hooks/queries';
import type { Contact } from '../../types';
import ContactFormDialog from './ContactFormDialog';

function ContactsListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(25);
  const [formOpen, setFormOpen] = useState(false);

  const { data, isLoading, isError } = useContacts({ search: search || undefined, page: page + 1, limit });

  const columns: DataTableColumn<Contact>[] = [
    { key: 'name', header: t('contacts.columns.name'), render: (r) => `${r.firstName} ${r.lastName}` },
    { key: 'title', header: t('contacts.columns.title'), render: (r) => r.title ?? '—' },
    { key: 'email', header: t('contacts.columns.email'), render: (r) => r.email ?? '—' },
    { key: 'phone', header: t('contacts.columns.phone'), render: (r) => r.phone ?? '—' },
  ];

  return (
    <Box>
      <PageHeader
        title={t('contacts.title')}
        subtitle={t('contacts.subtitle')}
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFormOpen(true)}>
            {t('contacts.new')}
          </Button>
        }
      />

      <TextField
        placeholder={t('contacts.searchPlaceholder')}
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
        onRowClick={(r) => navigate(`/app/contacts/${r.id}`)}
        emptyMessage={t('contacts.empty')}
        page={page}
        limit={limit}
        total={data?.total ?? 0}
        onPageChange={setPage}
        onLimitChange={(l) => {
          setLimit(l);
          setPage(0);
        }}
      />

      <ContactFormDialog open={formOpen} onClose={() => setFormOpen(false)} />
    </Box>
  );
}

export default ContactsListPage;
