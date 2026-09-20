import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPlaceFolder } from '../api/placeFolders'

export function useCreatePlaceFolder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPlaceFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['placeFolders'] })
    },
  })
}
