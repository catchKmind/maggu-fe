import type { PlaceFolderResponse } from './placeFolders.types'

export interface GetPlaceFolderScrapsParams {
  cursor?: string
  size?: number
}

export interface PlaceScrapResponse {
  placeScrapId: number
  /** 관광공사 콘텐츠 ID */
  tourismContentId: string
  /** 장소명. 캐시에 없는 장소거나 다른 언어로 저장한 장소면 null */
  placeName: string | null
  /** 주소. 캐시에 없는 장소거나 다른 언어로 저장한 장소면 null */
  placeAddress: string | null
  /** 이 장소를 저장할 때 고른 스티커 */
  stickerId: number
}

export interface PlaceFolderScrapsResponse {
  /** 폴더 전체 장소 수 (페이지와 무관) */
  totalScrapCount: number
  placeFolder: PlaceFolderResponse
  placeScraps: {
    content: PlaceScrapResponse[]
    nextCursor: string | null
    hasNext: boolean
  }
}
