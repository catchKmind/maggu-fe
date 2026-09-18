import { useQuery } from '@tanstack/react-query'
import { useDebouncedValue } from '../../../shared/hooks/useDebouncedValue'
import { getMapSearchAutocomplete } from '../api/mapSearch'

const DEBOUNCE_MS = 300

export function useMapSearchAutocomplete(keyword: string) {
  const debouncedKeyword = useDebouncedValue(keyword.trim(), DEBOUNCE_MS)

  return useQuery({
    queryKey: ['mapSearchAutocomplete', debouncedKeyword],
    queryFn: () => getMapSearchAutocomplete(debouncedKeyword),
    enabled: debouncedKeyword.length > 0,
  })
}
