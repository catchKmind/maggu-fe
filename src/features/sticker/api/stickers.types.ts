export interface StickerResponse {
  stickerId: number
  imageUrl: string
}

export interface StickerCreateRequest {
  imageUrl: string
}

export interface StickerDeleteResponse {
  stickerId: number
  deleted: boolean
}
