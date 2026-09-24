import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

interface InlineEditFieldOption {
  value: string;
  label: string;
}

interface InlineEditFieldProps {
  label: string;
  value: string;
  onSave: (value: string) => void;
  multiline?: boolean;
  type?: 'text' | 'number' | 'date';
  options?: InlineEditFieldOption[];
  placeholder?: string;
}

function InlineEditField({ label, value, onSave, multiline, type = 'text', options, placeholder }: InlineEditFieldProps) {
  const [draft, setDraft] = useState(value);
  const [focused, setFocused] = useState(false);

  const commit = (next: string) => {
    if (next !== value) onSave(next);
  };

  const resolvedOptions =
    options && !options.some((opt) => opt.value === '') ? [{ value: '', label: '—' }, ...options] : options;

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
        {label}
      </Typography>
      <TextField
        fullWidth
        size="small"
        variant="standard"
        select={!!options}
        multiline={multiline}
        minRows={multiline ? 2 : undefined}
        type={type}
        placeholder={placeholder}
        value={focused ? draft : value}
        slotProps={{
          input: { disableUnderline: true },
          inputLabel: type === 'date' ? { shrink: true } : undefined,
        }}
        sx={{
          '& .MuiInputBase-root': {
            borderRadius: 1,
            px: 0.5,
            mx: -0.5,
            transition: 'background-color 0.15s',
          },
          '& .MuiInputBase-root:hover': { bgcolor: 'action.hover' },
          '& .MuiInputBase-root.Mui-focused': { bgcolor: 'action.hover' },
        }}
        onFocus={() => {
          setDraft(value);
          setFocused(true);
        }}
        onChange={(e) => {
          const next = e.target.value;
          if (options) {
            setFocused(false);
            commit(next);
          } else {
            setDraft(next);
          }
        }}
        onBlur={() => {
          setFocused(false);
          if (!options) commit(draft);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !multiline) (e.currentTarget as HTMLElement).blur();
          if (e.key === 'Escape') {
            setDraft(value);
            (e.currentTarget as HTMLElement).blur();
          }
        }}
      >
        {resolvedOptions?.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}

export default InlineEditField;
