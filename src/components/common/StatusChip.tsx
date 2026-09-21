import Chip from '@mui/material/Chip';
import type { ChipProps } from '@mui/material/Chip';

const COLOR_MAP: Record<string, ChipProps['color']> = {
  new: 'info',
  contacted: 'primary',
  qualified: 'secondary',
  disqualified: 'default',
  converted: 'success',
  pending: 'warning',
  completed: 'success',
  cancelled: 'default',
};

interface StatusChipProps {
  status: string;
}

function StatusChip({ status }: StatusChipProps) {
  return <Chip size="small" label={status} color={COLOR_MAP[status] ?? 'default'} variant="outlined" />;
}

export default StatusChip;
