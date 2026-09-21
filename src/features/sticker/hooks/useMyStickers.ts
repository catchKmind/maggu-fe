import { useQuery } from '@tanstack/react-query'
import { getMyStickers } from '../api/stickers'

/** enabled로 호출 시점을 늦출 수 있다 (예: 바텀시트를 실제로 열었을 때만 조회) */
export function useMyStickers(enabled = true) {
  return useQuery({
    queryKey: ['myStickers'],
    queryFn: getMyStickers,
    enabled,
  })
}
