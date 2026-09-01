import { useQuery } from '@tanstack/react-query'
import { useDebouncedValue } from '../../../shared/hooks/useDebouncedValue'
import { getSearchAutocomplete } from '../api/posts'

const DEBOUNCE_MS = 300

export function useSearchAutocomplete(keyword: string) {
  const debouncedKeyword = useDebouncedValue(keyword.trim(), DEBOUNCE_MS)

  return useQuery({
    queryKey: ['searchAutocomplete', debouncedKeyword],
    queryFn: () => getSearchAutocomplete(debouncedKeyword).then((res) => res.keywords),
    enabled: debouncedKeyword.length > 0,
  })
}
