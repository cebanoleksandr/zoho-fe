import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import StarOutlineIcon from '@mui/icons-material/StarOutlineOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBackOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardOutlined';
import PageHeader from '../../components/common/PageHeader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import {
  usePipelines,
  useDeletePipeline,
  useUpdatePipeline,
  useRemoveStage,
  useReorderStages,
} from '../../hooks/queries';
import type { Pipeline, PipelineStage } from '../../types';
import PipelineFormDialog from './PipelineFormDialog';
import StageFormDialog from './StageFormDialog';

function PipelinesPage() {
  const { t } = useTranslation();
  const { data: pipelines, isLoading, isError } = usePipelines();
  const deletePipeline = useDeletePipeline();
  const updatePipeline = useUpdatePipeline();
  const deleteStage = useRemoveStage();
  const reorderStages = useReorderStages();

  const [pipelineFormOpen, setPipelineFormOpen] = useState(false);
  const [editingPipeline, setEditingPipeline] = useState<Pipeline | null>(null);
  const [deletePipelineId, setDeletePipelineId] = useState<string | null>(null);

  const [stageFormFor, setStageFormFor] = useState<string | null>(null);
  const [editingStage, setEditingStage] = useState<{ pipelineId: string; stage: PipelineStage } | null>(null);
  const [deletingStage, setDeletingStage] = useState<{ pipelineId: string; stage: PipelineStage } | null>(null);

  const canDeletePipeline = (pipelines?.length ?? 0) > 1;

  const openCreatePipeline = () => {
    setEditingPipeline(null);
    setPipelineFormOpen(true);
  };

  const openEditPipeline = (pipeline: Pipeline) => {
    setEditingPipeline(pipeline);
    setPipelineFormOpen(true);
  };

  const moveStage = (pipeline: Pipeline, stageId: string, direction: -1 | 1) => {
    const sorted = pipeline.stages.slice().sort((a, b) => a.orderIndex - b.orderIndex);
    const index = sorted.findIndex((s) => s.id === stageId);
    const targetIndex = index + direction;
    if (index === -1 || targetIndex < 0 || targetIndex >= sorted.length) return;
    const reordered = sorted.map((s) => s.id);
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    reorderStages.mutate({ pipelineId: pipeline.id, payload: { stageIds: reordered } });
  };

  return (
    <Box>
      <PageHeader
        title={t('pipelines.title')}
        subtitle={t('pipelines.subtitle')}
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreatePipeline}>
            {t('pipelines.new')}
          </Button>
        }
      />

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {!isLoading && isError && <Alert severity="error">{t('pipelines.errorLoading')}</Alert>}

      {!isLoading &&
        !isError &&
        (pipelines ?? []).map((pipeline) => {
          const sortedStages = pipeline.stages.slice().sort((a, b) => a.orderIndex - b.orderIndex);
          return (
            <Paper key={pipeline.id} elevation={0} sx={{ p: 3, border: '1px solid #e5e7eb', borderRadius: 2, mb: 2 }}>
              <Stack direction="row" spacing={1} sx={{ mb: 2, alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {pipeline.name}
                </Typography>
                {pipeline.isDefault ? (
                  <Chip size="small" label={t('pipelines.default')} color="primary" variant="outlined" />
                ) : (
                  <Tooltip title={t('pipelines.setDefault')}>
                    <IconButton
                      size="small"
                      disabled={updatePipeline.isPending}
                      onClick={() => updatePipeline.mutate({ id: pipeline.id, payload: { isDefault: true } })}
                    >
                      <StarOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                <Box sx={{ flexGrow: 1 }} />
                <Tooltip title={t('common.edit')}>
                  <IconButton size="small" onClick={() => openEditPipeline(pipeline)}>
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={canDeletePipeline ? t('common.delete') : t('pipelines.cannotDeleteLast')}>
                  <span>
                    <IconButton
                      size="small"
                      disabled={!canDeletePipeline}
                      onClick={() => setDeletePipelineId(pipeline.id)}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>

              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                {sortedStages.map((stage, index) => (
                  <Box
                    key={stage.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid #e5e7eb',
                      borderRadius: 4,
                      pl: 1.5,
                      pr: 0.5,
                      py: 0.25,
                      gap: 0.25,
                    }}
                  >
                    <Typography variant="body2" sx={{ mr: 0.5 }}>
                      {stage.name} · {stage.probability}%
                    </Typography>
                    {stage.isWon && <Chip size="small" label={t('pipelines.stageForm.isWon')} color="success" sx={{ mr: 0.5 }} />}
                    {stage.isLost && <Chip size="small" label={t('pipelines.stageForm.isLost')} color="error" sx={{ mr: 0.5 }} />}
                    <IconButton
                      size="small"
                      disabled={index === 0 || reorderStages.isPending}
                      onClick={() => moveStage(pipeline, stage.id, -1)}
                    >
                      <ArrowBackIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton
                      size="small"
                      disabled={index === sortedStages.length - 1 || reorderStages.isPending}
                      onClick={() => moveStage(pipeline, stage.id, 1)}
                    >
                      <ArrowForwardIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton size="small" onClick={() => setEditingStage({ pipelineId: pipeline.id, stage })}>
                      <EditOutlinedIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton size="small" onClick={() => setDeletingStage({ pipelineId: pipeline.id, stage })}>
                      <DeleteOutlineIcon fontSize="inherit" />
                    </IconButton>
                  </Box>
                ))}
                <Button size="small" startIcon={<AddIcon fontSize="small" />} onClick={() => setStageFormFor(pipeline.id)}>
                  {t('pipelines.addStage')}
                </Button>
              </Stack>
            </Paper>
          );
        })}

      {!isLoading && !isError && (pipelines ?? []).length === 0 && (
        <Typography color="text.secondary">{t('pipelines.empty')}</Typography>
      )}

      <PipelineFormDialog
        open={pipelineFormOpen}
        pipeline={editingPipeline}
        onClose={() => setPipelineFormOpen(false)}
      />

      <StageFormDialog
        open={!!stageFormFor}
        pipelineId={stageFormFor ?? ''}
        onClose={() => setStageFormFor(null)}
      />

      <StageFormDialog
        open={!!editingStage}
        pipelineId={editingStage?.pipelineId ?? ''}
        stage={editingStage?.stage}
        onClose={() => setEditingStage(null)}
      />

      <ConfirmDialog
        open={!!deletePipelineId}
        title={t('pipelines.deleteTitle')}
        description={t('common.cannotBeUndone')}
        loading={deletePipeline.isPending}
        onClose={() => setDeletePipelineId(null)}
        onConfirm={() => {
          if (deletePipelineId) deletePipeline.mutate(deletePipelineId, { onSuccess: () => setDeletePipelineId(null) });
        }}
      />

      <ConfirmDialog
        open={!!deletingStage}
        title={t('pipelines.deleteStageTitle')}
        description={t('common.cannotBeUndone')}
        loading={deleteStage.isPending}
        onClose={() => setDeletingStage(null)}
        onConfirm={() => {
          if (deletingStage) {
            deleteStage.mutate(
              { pipelineId: deletingStage.pipelineId, stageId: deletingStage.stage.id },
              { onSuccess: () => setDeletingStage(null) },
            );
          }
        }}
      />
    </Box>
  );
}

export default PipelinesPage;
