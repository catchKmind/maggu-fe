export interface FolderResponse {
  folderId: number
  name: string
  default: boolean
}

export interface FolderCreateRequest {
  name: string
}

export interface FolderCreateResponse {
  folderId: number
  name: string
}

export interface GetFolderScrapsParams {
  page?: number
  size?: number
}
