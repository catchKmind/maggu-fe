import { useQuery } from '@tanstack/react-query'
import { getMapSearchAutocomplete } from '../api/mapSearch'

/**
 * keyword는 useImeAwareInput의 committedValue를 받는 걸 전제로 함 —
 * 한글 조합 중간 상태가 아니라 완성된 값만 여기로 들어온다.
 */
export function useMapSearchAutocomplete(keyword: string) {
  const trimmedKeyword = keyword.trim()

  return useQuery({
    queryKey: ['mapSearchAutocomplete', trimmedKeyword],
    queryFn: () => getMapSearchAutocomplete(trimmedKeyword),
    enabled: trimmedKeyword.length > 0,
  })
}
