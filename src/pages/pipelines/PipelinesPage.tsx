import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const { data: pipelines, isLoading, isError } = usePipelines();

  return (
    <Box>
      <PageHeader title={t('pipelines.title')} subtitle={t('pipelines.subtitle')} />

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {!isLoading && isError && <Alert severity="error">{t('pipelines.errorLoading')}</Alert>}

      {!isLoading &&
        !isError &&
        (pipelines ?? []).map((pipeline) => (
          <Paper key={pipeline.id} elevation={0} sx={{ p: 3, border: '1px solid #e5e7eb', borderRadius: 2, mb: 2 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 2, alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {pipeline.name}
              </Typography>
              {pipeline.isDefault && <Chip size="small" label={t('pipelines.default')} color="primary" variant="outlined" />}
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
        <Typography color="text.secondary">{t('pipelines.empty')}</Typography>
      )}
    </Box>
  );
}

export default PipelinesPage;
