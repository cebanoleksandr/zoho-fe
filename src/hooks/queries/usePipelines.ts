import { useQuery } from '@tanstack/react-query';
import { pipelinesService } from '../../api/services';
import { queryKeys } from '../../api/queryKeys';

export function usePipelines() {
  return useQuery({
    queryKey: queryKeys.pipelines.lists(),
    queryFn: () => pipelinesService.list(),
  });
}

export function usePipeline(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.pipelines.detail(id),
    queryFn: () => pipelinesService.getById(id),
    enabled: enabled && !!id,
  });
}
