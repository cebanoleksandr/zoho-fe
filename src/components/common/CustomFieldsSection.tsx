import { useTranslation } from 'react-i18next';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import InlineEditField from './InlineEditField';
import {
  useCustomFieldDefinitions,
  useCustomFieldValues,
  useSetCustomFieldValues,
} from '../../hooks/queries';
import { CustomFieldType, type CrmEntityType, type CustomFieldValueType } from '../../types';

interface CustomFieldsSectionProps {
  entityType: CrmEntityType;
  entityId: string;
}

function CustomFieldsSection({ entityType, entityId }: CustomFieldsSectionProps) {
  const { t } = useTranslation();
  const { data: definitions } = useCustomFieldDefinitions(entityType);
  const { data: values } = useCustomFieldValues(entityType, entityId);
  const setValues = useSetCustomFieldValues();

  const valuesMap: Record<string, unknown> = values ?? {};

  if (!definitions || definitions.length === 0) return null;

  const saveField = (fieldKey: string, fieldType: CustomFieldType) => (raw: string) => {
    let parsed: CustomFieldValueType;
    if (raw === '') {
      parsed = null;
    } else if (fieldType === CustomFieldType.NUMBER) {
      parsed = Number(raw);
    } else if (fieldType === CustomFieldType.BOOLEAN) {
      parsed = raw === 'true';
    } else {
      parsed = raw;
    }
    setValues.mutate({ entityType, entityId, values: { ...valuesMap, [fieldKey]: parsed } });
  };

  return (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid #e5e7eb', borderRadius: 2, mt: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
        {t('customFields.title')}
      </Typography>

      <Grid container spacing={2}>
        {definitions.map((def) => {
          const currentValue = valuesMap[def.fieldKey];

          if (def.fieldType === CustomFieldType.BOOLEAN) {
            return (
              <Grid key={def.id} size={{ xs: 12, sm: 6 }}>
                <InlineEditField
                  label={def.label}
                  value={String(!!currentValue)}
                  onSave={saveField(def.fieldKey, def.fieldType)}
                  options={[
                    { value: 'true', label: t('common.yes') },
                    { value: 'false', label: t('common.no') },
                  ]}
                />
              </Grid>
            );
          }

          if (def.fieldType === CustomFieldType.SELECT) {
            return (
              <Grid key={def.id} size={{ xs: 12, sm: 6 }}>
                <InlineEditField
                  label={def.label}
                  value={currentValue == null ? '' : String(currentValue)}
                  onSave={saveField(def.fieldKey, def.fieldType)}
                  options={(def.options ?? []).map((opt) => ({ value: opt, label: opt }))}
                />
              </Grid>
            );
          }

          return (
            <Grid key={def.id} size={{ xs: 12, sm: 6 }}>
              <InlineEditField
                label={def.label}
                value={currentValue == null ? '' : String(currentValue)}
                onSave={saveField(def.fieldKey, def.fieldType)}
                type={def.fieldType === CustomFieldType.NUMBER ? 'number' : def.fieldType === CustomFieldType.DATE ? 'date' : 'text'}
              />
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
}

export default CustomFieldsSection;
