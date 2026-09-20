export interface PlaceFolderResponse {
  placeFolderId: number
  name: string
  icon: string
  isDefault: boolean
}

export interface PlaceFolderCreateRequest {
  name: string
  icon: string
}

export interface PlaceFolderCreateResponse {
  placeFolderId: number
  name: string
  icon: string
}
