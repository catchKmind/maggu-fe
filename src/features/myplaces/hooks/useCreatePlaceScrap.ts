import { useMutation } from '@tanstack/react-query'
import { createPlaceScrap } from '../api/placeScraps'

export function useCreatePlaceScrap() {
  return useMutation({
    mutationFn: createPlaceScrap,
  })
}
