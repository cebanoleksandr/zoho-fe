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
import PageHeader from '../../components/common/PageHeader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ActivitiesPanel from '../../components/common/ActivitiesPanel';
import CustomFieldsSection from '../../components/common/CustomFieldsSection';
import InlineEditField from '../../components/common/InlineEditField';
import { useContact, useUpdateContact, useDeleteContact, useAccount, useUser } from '../../hooks/queries';
import { CrmEntityType, type UpdateContactPayload } from '../../types';

function ContactDetailPage() {
  const { t } = useTranslation();
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: contact, isLoading, isError } = useContact(id);
  const { data: account } = useAccount(contact?.accountId ?? '', !!contact?.accountId);
  const { data: owner } = useUser(contact?.ownerId ?? '', !!contact?.ownerId);
  const updateContact = useUpdateContact();
  const deleteContact = useDeleteContact();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const saveField = (field: keyof UpdateContactPayload) => (value: string) => {
    updateContact.mutate({ id, payload: { [field]: value } as UpdateContactPayload });
  };

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
          <Button variant="outlined" color="error" startIcon={<DeleteOutlineIcon />} onClick={() => setConfirmOpen(true)}>
            {t('common.delete')}
          </Button>
        }
      />

      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e5e7eb', borderRadius: 2 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 6 }}>
            <InlineEditField label={t('auth.firstName')} value={contact.firstName} onSave={saveField('firstName')} />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <InlineEditField label={t('auth.lastName')} value={contact.lastName} onSave={saveField('lastName')} />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <InlineEditField label={t('common.title')} value={contact.title ?? ''} onSave={saveField('title')} />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <InlineEditField label={t('common.email')} value={contact.email ?? ''} onSave={saveField('email')} />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <InlineEditField label={t('common.phone')} value={contact.phone ?? ''} onSave={saveField('phone')} />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                {t('contacts.detail.account')}
              </Typography>
              <Typography variant="body2">{account?.name ?? '—'}</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                {t('common.owner')}
              </Typography>
              <Typography variant="body2">{owner ? `${owner.firstName} ${owner.lastName}` : '—'}</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <InlineEditField label={t('contacts.detail.notes')} value={contact.notes ?? ''} onSave={saveField('notes')} multiline />
          </Grid>
        </Grid>
      </Paper>

      <CustomFieldsSection entityType={CrmEntityType.CONTACT} entityId={id} />

      <ActivitiesPanel entityType={CrmEntityType.CONTACT} entityId={id} />

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
