export interface ScrapCreateRequest {
  postId: number
  folderId?: number
}

export interface ScrapResponse {
  postId: number
  folderId?: number
  scrapped: boolean
}
