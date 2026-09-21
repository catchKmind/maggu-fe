import { useQuery } from '@tanstack/react-query'
import { searchMapSpots } from '../api/mapSpots'

export function useSearchMapSpots(keyword: string | null) {
  return useQuery({
    queryKey: ['searchMapSpots', keyword],
    queryFn: () => searchMapSpots(keyword as string),
    enabled: keyword !== null && keyword.length > 0,
  })
}
