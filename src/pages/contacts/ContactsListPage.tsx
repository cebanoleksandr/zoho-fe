import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(25);
  const [formOpen, setFormOpen] = useState(false);

  const { data, isLoading, isError } = useContacts({ search: search || undefined, page: page + 1, limit });

  const columns: DataTableColumn<Contact>[] = [
    { key: 'name', header: 'Name', render: (r) => `${r.firstName} ${r.lastName}` },
    { key: 'title', header: 'Title', render: (r) => r.title ?? '—' },
    { key: 'email', header: 'Email', render: (r) => r.email ?? '—' },
    { key: 'phone', header: 'Phone', render: (r) => r.phone ?? '—' },
  ];

  return (
    <Box>
      <PageHeader
        title="Contacts"
        subtitle="People associated with your accounts"
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFormOpen(true)}>
            New Contact
          </Button>
        }
      />

      <TextField
        placeholder="Search contacts…"
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
        onRowClick={(r) => navigate(`/app/contacts/${r.id}`)}
        emptyMessage="No contacts found."
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
