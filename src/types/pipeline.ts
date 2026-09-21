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
