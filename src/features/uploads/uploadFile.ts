import { getPresignedUrl } from './api/uploads'
import type { UploadDomain } from './api/uploads.types'

/**
 * presigned URL을 발급받아 파일을 S3에 직접 PUT한다 (백엔드를 거치지 않음).
 * 성공하면 스티커/게시글 생성 API의 imageUrl로 그대로 넘길 objectKey를 반환한다.
 */
export async function uploadFile(file: Blob, domain: UploadDomain): Promise<string> {
  const { presignedUrl, objectKey } = await getPresignedUrl({ contentType: file.type, domain })

  const res = await fetch(presignedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  })
  if (!res.ok) throw new Error('이미지 업로드에 실패했습니다')

  return objectKey
}
