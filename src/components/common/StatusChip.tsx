import Chip from '@mui/material/Chip';
import type { ChipProps } from '@mui/material/Chip';

const COLOR_MAP: Record<string, ChipProps['color']> = {
  NEW: 'info',
  CONTACTED: 'primary',
  QUALIFIED: 'secondary',
  UNQUALIFIED: 'default',
  CONVERTED: 'success',
  PENDING: 'warning',
  COMPLETED: 'success',
};

interface StatusChipProps {
  status: string;
}

function StatusChip({ status }: StatusChipProps) {
  return <Chip size="small" label={status} color={COLOR_MAP[status] ?? 'default'} variant="outlined" />;
}

export default StatusChip;
