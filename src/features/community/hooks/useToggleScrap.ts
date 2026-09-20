import { useMutation, useQueryClient } from '@tanstack/react-query'
import { scrapPost, unscrapPost } from '../api/scraps'

interface ToggleScrapInput {
  postId: number
  scrapped: boolean
}

export function useToggleScrap() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, scrapped }: ToggleScrapInput) =>
      scrapped ? unscrapPost(postId) : scrapPost({ postId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityFeed'] })
    },
  })
}
