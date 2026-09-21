import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import PageHeader from '../../components/common/PageHeader';
import { usePipelines } from '../../hooks/queries';

function PipelinesPage() {
  const { data: pipelines, isLoading, isError } = usePipelines();

  return (
    <Box>
      <PageHeader title="Pipelines" subtitle="Sales stages used to track deal progress" />

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {!isLoading && isError && <Alert severity="error">Failed to load pipelines.</Alert>}

      {!isLoading &&
        !isError &&
        (pipelines ?? []).map((pipeline) => (
          <Paper key={pipeline.id} elevation={0} sx={{ p: 3, border: '1px solid #e5e7eb', borderRadius: 2, mb: 2 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 2, alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {pipeline.name}
              </Typography>
              {pipeline.isDefault && <Chip size="small" label="Default" color="primary" variant="outlined" />}
            </Stack>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {pipeline.stages
                .slice()
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((stage) => (
                  <Chip
                    key={stage.id}
                    label={`${stage.name} · ${stage.probability}%`}
                    color={stage.isWon ? 'success' : stage.isLost ? 'error' : 'default'}
                    variant={stage.isWon || stage.isLost ? 'filled' : 'outlined'}
                  />
                ))}
            </Stack>
          </Paper>
        ))}

      {!isLoading && !isError && (pipelines ?? []).length === 0 && (
        <Typography color="text.secondary">No pipelines configured.</Typography>
      )}
    </Box>
  );
}

export default PipelinesPage;
