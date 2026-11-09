export interface StickerResponse {
  stickerId: number
  imageUrl: string
}

export interface StickerCreateRequest {
  imageUrl: string
}

/** GIPHY 스티커 저장 요청. GIPHY 호출은 FE가 하고, BE는 고른 GIF의 id와 이미지 URL만 저장한다. */
export interface GiphyStickerCreateRequest {
  giphyId: string
  imageUrl: string
}

export interface StickerDeleteResponse {
  stickerId: number
  deleted: boolean
}
