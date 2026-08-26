/**
 * undefined 값은 제외하고 쿼리스트링을 만든다. 비어있으면 빈 문자열을 반환.
 */
export function toQueryString<T extends object>(params: T) {
  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params) as [string, string | number | boolean | undefined][]) {
    if (value !== undefined) searchParams.set(key, String(value))
  }
  const query = searchParams.toString()
  return query ? `?${query}` : ''
}
