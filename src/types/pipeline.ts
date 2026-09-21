export interface PipelineStage {
  id: string;
  pipelineId: string;
  name: string;
  orderIndex: number;
  probability: number;
  isWon: boolean;
  isLost: boolean;
}

export interface Pipeline {
  id: string;
  organizationId: string;
  name: string;
  isDefault: boolean;
  stages: PipelineStage[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateStagePayload {
  name: string;
  probability?: number;
  isWon?: boolean;
  isLost?: boolean;
}

export type UpdateStagePayload = Partial<CreateStagePayload>;

export interface CreatePipelinePayload {
  name: string;
  /** Optional initial stages, in the order they should appear. */
  stages?: CreateStagePayload[];
}

export interface UpdatePipelinePayload {
  name?: string;
  isDefault?: boolean;
}

export interface ReorderStagesPayload {
  /** Stage ids in the desired display order. Must include every stage of the pipeline exactly once. */
  stageIds: string[];
}
