import { api, type ApiResponse } from '../../../shared/lib/api'
import type { StickerCreateRequest, StickerDeleteResponse, StickerResponse } from './stickers.types'

const STICKERS_PATH = '/api/v1/stickers'

export function getMyStickers() {
  return api.get<ApiResponse<StickerResponse[]>>(STICKERS_PATH).then((res) => res.data)
}

export function createMySticker(body: StickerCreateRequest) {
  return api.post<ApiResponse<StickerResponse>>(STICKERS_PATH, body).then((res) => res.data)
}

export function deleteMySticker(stickerId: number) {
  return api.delete<ApiResponse<StickerDeleteResponse>>(`${STICKERS_PATH}/${stickerId}`).then((res) => res.data)
}
