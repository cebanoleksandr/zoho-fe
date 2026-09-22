import { useState } from 'react';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DataTable, { type DataTableColumn } from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import {
  useCustomFieldDefinitions,
  useCreateCustomFieldDefinition,
  useUpdateCustomFieldDefinition,
  useDeleteCustomFieldDefinition,
} from '../../hooks/queries';
import {
  CrmEntityType,
  CustomFieldType,
  type CustomFieldDefinition,
} from '../../types';

function CustomFieldsPanel() {
  const { t } = useTranslation();
  const [entityType, setEntityType] = useState<CrmEntityType | 'ALL'>('ALL');
  const { data: definitions, isLoading, isError } = useCustomFieldDefinitions(
    entityType === 'ALL' ? undefined : entityType,
  );
  const createDefinition = useCreateCustomFieldDefinition();
  const updateDefinition = useUpdateCustomFieldDefinition();
  const deleteDefinition = useDeleteCustomFieldDefinition();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CustomFieldDefinition | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const schema = yup.object({
    entityType: yup.mixed<CrmEntityType>().oneOf(Object.values(CrmEntityType)).required(t('settings.customFields.validation.entityTypeRequired')),
    fieldKey: yup
      .string()
      .matches(/^[a-z][a-z0-9_]*$/, t('settings.customFields.validation.fieldKeyFormat'))
      .required(t('settings.customFields.validation.fieldKeyRequired')),
    label: yup.string().required(t('settings.customFields.validation.labelRequired')),
    fieldType: yup.mixed<CustomFieldType>().oneOf(Object.values(CustomFieldType)).required(t('settings.customFields.validation.fieldTypeRequired')),
    options: yup.string().optional(),
    required: yup.boolean().optional(),
  });

  type FormValues = yup.InferType<typeof schema>;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    values: editing
      ? {
          entityType: editing.entityType,
          fieldKey: editing.fieldKey,
          label: editing.label,
          fieldType: editing.fieldType,
          options: (editing.options ?? []).join(', '),
          required: editing.required,
        }
      : undefined,
    defaultValues: { required: false },
  });

  const fieldType = useWatch({ control, name: 'fieldType' });

  const handleClose = () => {
    reset({ entityType: undefined, fieldKey: '', label: '', fieldType: undefined, options: '', required: false });
    setFormOpen(false);
    setEditing(null);
  };

  const onSubmit = handleSubmit((values) => {
    const options =
      values.fieldType === CustomFieldType.SELECT && values.options
        ? values.options.split(',').map((o) => o.trim()).filter(Boolean)
        : undefined;

    if (editing) {
      updateDefinition.mutate(
        {
          id: editing.id,
          payload: {
            label: values.label,
            fieldType: values.fieldType,
            options,
            required: values.required,
          },
        },
        { onSuccess: handleClose },
      );
    } else {
      createDefinition.mutate(
        {
          entityType: values.entityType,
          fieldKey: values.fieldKey,
          label: values.label,
          fieldType: values.fieldType,
          options,
          required: values.required,
        },
        { onSuccess: handleClose },
      );
    }
  });

  const columns: DataTableColumn<CustomFieldDefinition>[] = [
    { key: 'label', header: t('settings.customFields.columns.label'), render: (r) => r.label },
    { key: 'fieldKey', header: t('settings.customFields.columns.fieldKey'), render: (r) => r.fieldKey },
    { key: 'entityType', header: t('settings.customFields.columns.entityType'), render: (r) => r.entityType },
    { key: 'fieldType', header: t('settings.customFields.columns.fieldType'), render: (r) => r.fieldType },
    {
      key: 'required',
      header: t('settings.customFields.columns.required'),
      width: 90,
      render: (r) => <Switch size="small" checked={r.required} disabled />,
    },
    {
      key: 'actions',
      header: '',
      width: 90,
      render: (r) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title={t('common.edit')}>
            <IconButton size="small" onClick={() => setEditing(r)}>
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('common.delete')}>
            <IconButton size="small" onClick={() => setDeleteId(r.id)}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          select
          size="small"
          label={t('settings.customFields.filterEntity')}
          value={entityType}
          onChange={(e) => setEntityType(e.target.value as CrmEntityType | 'ALL')}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="ALL">{t('common.all')}</MenuItem>
          {Object.values(CrmEntityType).map((ty) => (
            <MenuItem key={ty} value={ty}>
              {ty}
            </MenuItem>
          ))}
        </TextField>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFormOpen(true)}>
          {t('settings.customFields.new')}
        </Button>
      </Box>

      <DataTable
        columns={columns}
        rows={definitions ?? []}
        getRowId={(r) => r.id}
        isLoading={isLoading}
        isError={isError}
        emptyMessage={t('settings.customFields.empty')}
      />

      <Dialog open={formOpen || !!editing} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editing ? t('settings.customFields.form.editTitle') : t('settings.customFields.form.title')}
        </DialogTitle>
        <form onSubmit={onSubmit} noValidate>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 0.5 }}>
              <Controller
                name="entityType"
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    label={t('settings.customFields.form.entityType')}
                    fullWidth
                    {...field}
                    value={field.value ?? ''}
                    disabled={!!editing}
                    error={!!errors.entityType}
                    helperText={errors.entityType?.message}
                  >
                    {Object.values(CrmEntityType).map((ty) => (
                      <MenuItem key={ty} value={ty}>
                        {ty}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <TextField
                label={t('settings.customFields.form.fieldKey')}
                fullWidth
                disabled={!!editing}
                placeholder="e.g. industry_segment"
                {...register('fieldKey')}
                error={!!errors.fieldKey}
                helperText={errors.fieldKey?.message}
              />
              <TextField
                label={t('settings.customFields.form.label')}
                fullWidth
                {...register('label')}
                error={!!errors.label}
                helperText={errors.label?.message}
              />
              <Controller
                name="fieldType"
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    label={t('settings.customFields.form.fieldType')}
                    fullWidth
                    {...field}
                    value={field.value ?? ''}
                    error={!!errors.fieldType}
                    helperText={errors.fieldType?.message}
                  >
                    {Object.values(CustomFieldType).map((ty) => (
                      <MenuItem key={ty} value={ty}>
                        {ty}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              {fieldType === CustomFieldType.SELECT && (
                <TextField
                  label={t('settings.customFields.form.options')}
                  fullWidth
                  placeholder="Option A, Option B, Option C"
                  {...register('options')}
                  helperText={t('settings.customFields.form.optionsHelper')}
                />
              )}
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Controller
                  name="required"
                  control={control}
                  render={({ field }) => (
                    <Switch checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} />
                  )}
                />
                <Box>{t('settings.customFields.form.required')}</Box>
                {editing && (
                  <Chip size="small" label={t('settings.customFields.form.lockedNotice')} sx={{ ml: 1 }} />
                )}
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>{t('common.cancel')}</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createDefinition.isPending || updateDefinition.isPending}
            >
              {createDefinition.isPending || updateDefinition.isPending
                ? t('common.saving')
                : editing
                  ? t('common.save')
                  : t('common.create')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        title={t('settings.customFields.deleteTitle')}
        description={t('common.cannotBeUndone')}
        loading={deleteDefinition.isPending}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteDefinition.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
        }}
      />
    </Box>
  );
}

export default CustomFieldsPanel;
