import { useQuery } from '@tanstack/react-query'
import { getPlaceFolders } from '../api/placeFolders'

export function usePlaceFolders() {
  return useQuery({
    queryKey: ['placeFolders'],
    queryFn: getPlaceFolders,
  })
}
