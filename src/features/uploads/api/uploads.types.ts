export type UploadDomain = 'STICKER' | 'POST'

export interface PresignedUrlRequest {
  contentType: string
  domain: UploadDomain
}

export interface PresignedUrlResponse {
  presignedUrl: string
  objectKey: string
}
