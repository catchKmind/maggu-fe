import { useQuery } from '@tanstack/react-query'
import { getMyStickers } from '../api/stickers'

export function useMyStickers() {
  return useQuery({
    queryKey: ['myStickers'],
    queryFn: getMyStickers,
  })
}
