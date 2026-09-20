export interface PlaceScrapCreateRequest {
  tourismContentId: string
  stickerId: number
  placeFolderId: number
}

export interface PlaceScrapCreateResponse {
  placeScrapId: number
  tourismContentId: string
  stickerId: number
  placeFolderId: number
}
