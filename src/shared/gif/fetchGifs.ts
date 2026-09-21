import type { ComponentProps } from 'react'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { Grid } from '@giphy/react-components'

const API_KEY = import.meta.env.VITE_GIPHY_API_KEY
const PAGE_SIZE = 24

type FetchGifs = ComponentProps<typeof Grid>['fetchGifs']

const gf = new GiphyFetch(API_KEY)

/**
 * Giphy API를 프론트에서 직접 호출한다 (검색어 없으면 트렌딩).
 * VITE_GIPHY_API_KEY는 Giphy가 클라이언트 배포용으로 발급하는 공개 키라 번들에 노출돼도 무방하다.
 */
export function makeFetchGifs(term: string): FetchGifs {
  return (offset: number) =>
    term ? gf.search(term, { offset, limit: PAGE_SIZE }) : gf.trending({ offset, limit: PAGE_SIZE })
}
