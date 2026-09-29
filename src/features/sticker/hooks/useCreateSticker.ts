import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createMySticker } from '../api/stickers'
import { uploadFile } from '../../uploads/uploadFile'

export function useCreateSticker() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (sticker: Blob) => {
      const objectKey = await uploadFile(sticker, 'STICKER')
      return createMySticker({ imageUrl: objectKey })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myStickers'] })
    },
  })
}
