import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteMySticker } from '../api/stickers'

export function useDeleteSticker() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteMySticker,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myStickers'] })
    },
  })
}
