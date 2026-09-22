import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
  useCustomFieldDefinitions,
  useCustomFieldValues,
  useSetCustomFieldValues,
} from '../../hooks/queries';
import { CustomFieldType, type CrmEntityType } from '../../types';

interface CustomFieldsSectionProps {
  entityType: CrmEntityType;
  entityId: string;
}

function CustomFieldsSection({ entityType, entityId }: CustomFieldsSectionProps) {
  const { t } = useTranslation();
  const { data: definitions } = useCustomFieldDefinitions(entityType);
  const { data: values } = useCustomFieldValues(entityType, entityId);
  const setValues = useSetCustomFieldValues();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Record<string, unknown>>({});

  const valuesMap: Record<string, unknown> = values ?? {};

  if (!definitions || definitions.length === 0) return null;

  const startEditing = () => {
    setDraft(valuesMap);
    setEditing(true);
  };

  const valueFor = (key: string) => draft[key] ?? '';

  const handleSave = () => {
    const payload: Record<string, string | number | boolean | null> = {};
    definitions.forEach((def) => {
      const raw = draft[def.fieldKey];
      payload[def.fieldKey] = raw === '' || raw === undefined ? null : (raw as string | number | boolean);
    });
    setValues.mutate(
      { entityType, entityId, values: payload },
      { onSuccess: () => setEditing(false) },
    );
  };

  const renderDisplay = (value: unknown) => {
    if (value === null || value === undefined || value === '') return '—';
    if (typeof value === 'boolean') return value ? t('common.yes') : t('common.no');
    return String(value);
  };

  return (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid #e5e7eb', borderRadius: 2, mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {t('customFields.title')}
        </Typography>
        {!editing && (
          <Button size="small" startIcon={<EditOutlinedIcon />} onClick={startEditing}>
            {t('common.edit')}
          </Button>
        )}
      </Box>

      <Grid container spacing={2}>
        {definitions.map((def) => (
          <Grid key={def.id} size={{ xs: 12, sm: 6 }}>
            {!editing ? (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {def.label}
                </Typography>
                <Typography variant="body2">{renderDisplay(valuesMap[def.fieldKey])}</Typography>
              </Box>
            ) : def.fieldType === CustomFieldType.BOOLEAN ? (
              <FormControlLabel
                control={
                  <Switch
                    checked={!!draft[def.fieldKey]}
                    onChange={(e) => setDraft((d) => ({ ...d, [def.fieldKey]: e.target.checked }))}
                  />
                }
                label={def.label}
              />
            ) : def.fieldType === CustomFieldType.SELECT ? (
              <TextField
                select
                fullWidth
                size="small"
                label={def.label}
                required={def.required}
                value={valueFor(def.fieldKey)}
                onChange={(e) => setDraft((d) => ({ ...d, [def.fieldKey]: e.target.value }))}
              >
                <MenuItem value="">—</MenuItem>
                {(def.options ?? []).map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <TextField
                fullWidth
                size="small"
                label={def.label}
                required={def.required}
                type={
                  def.fieldType === CustomFieldType.NUMBER
                    ? 'number'
                    : def.fieldType === CustomFieldType.DATE
                      ? 'date'
                      : 'text'
                }
                slotProps={def.fieldType === CustomFieldType.DATE ? { inputLabel: { shrink: true } } : undefined}
                value={valueFor(def.fieldKey)}
                onChange={(e) => {
                  const raw = e.target.value;
                  setDraft((d) => ({
                    ...d,
                    [def.fieldKey]: def.fieldType === CustomFieldType.NUMBER ? (raw === '' ? '' : Number(raw)) : raw,
                  }));
                }}
              />
            )}
          </Grid>
        ))}
      </Grid>

      {editing && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
          <Button onClick={() => setEditing(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" disabled={setValues.isPending} onClick={handleSave}>
            {setValues.isPending ? t('common.saving') : t('common.save')}
          </Button>
        </Box>
      )}
    </Paper>
  );
}

export default CustomFieldsSection;
