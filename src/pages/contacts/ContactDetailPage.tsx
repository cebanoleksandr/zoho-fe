import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PageHeader from '../../components/common/PageHeader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ActivitiesPanel from '../../components/common/ActivitiesPanel';
import { useContact, useDeleteContact } from '../../hooks/queries';
import { CrmEntityType } from '../../types';
import ContactFormDialog from './ContactFormDialog';

function Field({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Box>
  );
}

function ContactDetailPage() {
  const { t } = useTranslation();
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: contact, isLoading, isError } = useContact(id);
  const deleteContact = useDeleteContact();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !contact) {
    return <Alert severity="error">{t('contacts.detail.notFound')}</Alert>;
  }

  return (
    <Box>
      <PageHeader
        title={`${contact.firstName} ${contact.lastName}`}
        subtitle={contact.title ?? undefined}
        actions={
          <>
            <Button variant="outlined" startIcon={<EditOutlinedIcon />} onClick={() => setEditOpen(true)}>
              {t('common.edit')}
            </Button>
            <Button variant="outlined" color="error" startIcon={<DeleteOutlineIcon />} onClick={() => setConfirmOpen(true)}>
              {t('common.delete')}
            </Button>
          </>
        }
      />

      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e5e7eb', borderRadius: 2 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 6 }}>
            <Field label={t('common.email')} value={contact.email ?? '—'} />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Field label={t('common.phone')} value={contact.phone ?? '—'} />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Field label={t('contacts.detail.account')} value={contact.accountId ?? '—'} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Field label={t('contacts.detail.notes')} value={contact.notes ?? '—'} />
          </Grid>
        </Grid>
      </Paper>

      <ActivitiesPanel entityType={CrmEntityType.CONTACT} entityId={id} />

      <ContactFormDialog open={editOpen} contact={contact} onClose={() => setEditOpen(false)} />

      <ConfirmDialog
        open={confirmOpen}
        title={t('contacts.detail.deleteTitle')}
        description={t('common.cannotBeUndone')}
        loading={deleteContact.isPending}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() =>
          deleteContact.mutate(id, {
            onSuccess: () => navigate('/app/contacts'),
          })
        }
      />
    </Box>
  );
}

export default ContactDetailPage;
