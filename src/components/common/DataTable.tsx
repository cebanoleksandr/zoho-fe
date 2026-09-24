import type { ReactNode, CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRowClick?: (row: T) => void;
  getRowSx?: (row: T) => CSSProperties;
  emptyMessage?: string;
  page?: number;
  limit?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

function DataTable<T>({
  columns,
  rows,
  getRowId,
  isLoading,
  isError,
  errorMessage,
  onRowClick,
  getRowSx,
  emptyMessage,
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
}: DataTableProps<T>) {
  const { t } = useTranslation();
  const paginated = page !== undefined && limit !== undefined && total !== undefined;
  const resolvedErrorMessage = errorMessage ?? t('common.errorLoading');
  const resolvedEmptyMessage = emptyMessage ?? t('common.noRecords');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const pagination = paginated && (
    <TablePagination
      component="div"
      count={total}
      page={page}
      rowsPerPage={limit}
      rowsPerPageOptions={[10, 25, 50]}
      labelRowsPerPage={isMobile ? '' : undefined}
      onPageChange={(_e, newPage) => onPageChange?.(newPage)}
      onRowsPerPageChange={(e) => onLimitChange?.(Number(e.target.value))}
      sx={isMobile ? { '& .MuiTablePagination-toolbar': { px: 1 }, '& .MuiTablePagination-spacer': { display: 'none' } } : undefined}
    />
  );

  if (isMobile) {
    return (
      <Paper elevation={0} sx={{ border: '1px solid #e5e7eb', borderRadius: 2, overflow: 'hidden' }}>
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={28} />
          </Box>
        )}

        {!isLoading && isError && (
          <Alert severity="error" sx={{ m: 1 }}>
            {resolvedErrorMessage}
          </Alert>
        )}

        {!isLoading && !isError && rows.length === 0 && (
          <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
            {resolvedEmptyMessage}
          </Typography>
        )}

        {!isLoading &&
          !isError &&
          rows.map((row) => (
            <Box
              key={getRowId(row)}
              onClick={() => onRowClick?.(row)}
              sx={{
                px: 2,
                py: 1.5,
                borderBottom: '1px solid #e5e7eb',
                cursor: onRowClick ? 'pointer' : 'default',
                '&:last-of-type': { borderBottom: paginated ? undefined : 'none' },
                '&:active': onRowClick ? { bgcolor: 'action.hover' } : undefined,
                ...getRowSx?.(row),
              }}
            >
              {columns.map((col) =>
                col.header ? (
                  <Box
                    key={col.key}
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, py: 0.5 }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                      {col.header}
                    </Typography>
                    <Box sx={{ minWidth: 0, textAlign: 'right', fontSize: 14, wordBreak: 'break-word' }}>
                      {col.render(row)}
                    </Box>
                  </Box>
                ) : (
                  <Box key={col.key} sx={{ display: 'flex', justifyContent: 'flex-end', pt: 0.5 }}>
                    {col.render(row)}
                  </Box>
                ),
              )}
            </Box>
          ))}

        {pagination}
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{ border: '1px solid #e5e7eb', borderRadius: 2, overflow: 'hidden' }}>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f9fafb' }}>
              {columns.map((col) => (
                <TableCell key={col.key} align={col.align} sx={{ fontWeight: 600, width: col.width }}>
                  {col.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={28} />
                  </Box>
                </TableCell>
              </TableRow>
            )}

            {!isLoading && isError && (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <Alert severity="error" sx={{ m: 1 }}>
                    {resolvedErrorMessage}
                  </Alert>
                </TableCell>
              </TableRow>
            )}

            {!isLoading && !isError && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
                    {resolvedEmptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              !isError &&
              rows.map((row) => (
                <TableRow
                  key={getRowId(row)}
                  hover
                  onClick={() => onRowClick?.(row)}
                  sx={{ cursor: onRowClick ? 'pointer' : 'default', ...getRowSx?.(row) }}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key} align={col.align}>
                      {col.render(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination}
    </Paper>
  );
}

export default DataTable;
