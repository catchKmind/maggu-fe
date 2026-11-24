import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPlaceScrap } from '../api/placeScraps'

export function useCreatePlaceScrap() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPlaceScrap,
    onSuccess: () => {
      // 저장한 장소가 리스트 상세에 바로 보이도록
      queryClient.invalidateQueries({ queryKey: ['placeFolderScraps'] })
    },
  })
}
