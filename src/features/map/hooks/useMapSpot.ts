import { useQuery } from '@tanstack/react-query'
import { getMapSpot } from '../api/mapSpots'

export function useMapSpot(contentId: string | null) {
  return useQuery({
    queryKey: ['mapSpot', contentId],
    queryFn: () => getMapSpot(contentId as string),
    enabled: contentId !== null,
  })
}
