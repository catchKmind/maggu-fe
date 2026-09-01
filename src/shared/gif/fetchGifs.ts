import type { ComponentProps } from 'react'
import { Grid } from '@giphy/react-components'
import { getAuthToken } from '../lib/authToken'
import { getPlatform } from '../lib/platform'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
const GIF_PATH = '/api/v1/gif'
const PAGE_SIZE = 24

type FetchGifs = ComponentProps<typeof Grid>['fetchGifs']

/**
 * 백엔드 /api/v1/gif가 Giphy 응답({ data, pagination, meta })을 가공 없이
 * 그대로 흘려보내는 프록시라는 전제. Giphy API 키는 서버에만 있고 여기선 안 씀.
 * 검색어가 없으면 백엔드가 trending으로 처리.
 */
export function makeFetchGifs(term: string): FetchGifs {
  return async (offset: number) => {
    const params = new URLSearchParams({ offset: String(offset), limit: String(PAGE_SIZE) })
    if (term) params.set('q', term)

    const token = getAuthToken()
    const res = await fetch(`${BASE_URL}${GIF_PATH}?${params}`, {
      headers: {
        'x-client-platform': getPlatform(),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    if (!res.ok) throw new Error('gif fetch failed')
    return res.json()
  }
}
