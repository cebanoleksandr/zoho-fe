import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { useAccounts, useContacts, useDeals, useLeads } from '../../hooks/queries';
import { CrmEntityType, type CrmEntityType as CrmEntityTypeValue } from '../../types';

interface RecordOption {
  id: string;
  label: string;
}

interface RecordAutocompleteProps {
  entityType?: CrmEntityTypeValue;
  value: string | null;
  onChange: (id: string | null) => void;
  label: string;
  error?: boolean;
  helperText?: string;
}

// The backend only supports server-side `search` for /contacts and /accounts.
// /leads and /deals reject the `search` query param, so for those we fetch a
// larger batch once and filter it client-side by the typed text instead.
const CLIENT_FILTER_BATCH_SIZE = 100;

function RecordAutocomplete({ entityType, value, onChange, label, error, helperText }: RecordAutocompleteProps) {
  const { t } = useTranslation();
  // This only drives the search query — it's intentionally NOT passed back
  // into Autocomplete's `inputValue` prop. Controlling that prop as well
  // creates a feedback loop: MUI resets the displayed text via
  // onInputChange whenever it thinks `value` changed, which updates this
  // state, which re-renders the component, which (depending on how options
  // are derived) can make MUI think `value` changed again — infinite loop.
  // Leaving `inputValue` uncontrolled lets MUI own the displayed text and
  // sync it internally when `value` changes.
  const [search, setSearch] = useState('');

  const leads = useLeads({ limit: CLIENT_FILTER_BATCH_SIZE }, entityType === CrmEntityType.LEAD);
  const contacts = useContacts({ search: search || undefined, limit: 20 }, entityType === CrmEntityType.CONTACT);
  const accounts = useAccounts({ search: search || undefined, limit: 20 }, entityType === CrmEntityType.ACCOUNT);
  const deals = useDeals({ limit: CLIENT_FILTER_BATCH_SIZE }, entityType === CrmEntityType.DEAL);

  const { allOptions, isLoading } = useMemo<{ allOptions: RecordOption[]; isLoading: boolean }>(() => {
    switch (entityType) {
      case CrmEntityType.LEAD:
        return {
          allOptions: (leads.data?.data ?? []).map((r) => ({
            id: r.id,
            label: r.company ? `${r.firstName} ${r.lastName} — ${r.company}` : `${r.firstName} ${r.lastName}`,
          })),
          isLoading: leads.isFetching,
        };
      case CrmEntityType.CONTACT:
        return {
          allOptions: (contacts.data?.data ?? []).map((r) => ({ id: r.id, label: `${r.firstName} ${r.lastName}` })),
          isLoading: contacts.isFetching,
        };
      case CrmEntityType.ACCOUNT:
        return {
          allOptions: (accounts.data?.data ?? []).map((r) => ({ id: r.id, label: r.name })),
          isLoading: accounts.isFetching,
        };
      case CrmEntityType.DEAL:
        return {
          allOptions: (deals.data?.data ?? []).map((r) => ({ id: r.id, label: r.name })),
          isLoading: deals.isFetching,
        };
      default:
        return { allOptions: [], isLoading: false };
    }
  }, [entityType, leads.data, leads.isFetching, contacts.data, contacts.isFetching, accounts.data, accounts.isFetching, deals.data, deals.isFetching]);

  const needsClientFilter = entityType === CrmEntityType.LEAD || entityType === CrmEntityType.DEAL;
  const options = needsClientFilter
    ? allOptions.filter((o) => o.label.toLowerCase().includes(search.trim().toLowerCase()))
    : allOptions;

  const selectedOption = allOptions.find((o) => o.id === value) ?? null;

  return (
    <Autocomplete
      fullWidth
      options={options}
      value={selectedOption}
      onInputChange={(_e, newValue, reason) => {
        if (reason === 'input') setSearch(newValue);
      }}
      onChange={(_e, option) => onChange(option?.id ?? null)}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      disabled={!entityType}
      loading={isLoading}
      noOptionsText={t('common.noRecords')}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={error}
          helperText={helperText}
          slotProps={{
            ...params.slotProps,
            input: {
              ...params.slotProps.input,
              endAdornment: (
                <>
                  {isLoading && <CircularProgress size={16} />}
                  {params.slotProps.input.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
}

export default RecordAutocomplete;
