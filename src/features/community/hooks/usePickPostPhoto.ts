import { Camera, type MediaResult } from '@capacitor/camera'
import { isNativeApp } from '../../../shared/lib/platform'
import { extractExifCoordinates } from '../photoMetadata'
import { reverseGeocode } from '../../../shared/lib/reverseGeocode'
import type { PostLocation } from '../types'

export interface PickedPhoto {
  previewUrl: string
  /** 완료를 눌렀을 때(제출 시점) 업로드할 원본 파일 */
  blob: Blob
  /** EXIF에 GPS가 있고(네이티브 전용) 역지오코딩까지 성공했을 때만 채워짐 */
  location: PostLocation | null
}

async function resolvePickedMedia(result: MediaResult): Promise<PickedPhoto> {
  const source = result.webPath ?? result.uri
  if (!source) throw new Error('사진을 불러오지 못했습니다')

  const blob = await fetch(source).then((res) => res.blob())

  let location: PostLocation | null = null
  // exif는 네이티브(iOS/Android)에서만 내려온다 — 웹에서는 항상 null
  if (isNativeApp()) {
    const coords = extractExifCoordinates(result.metadata?.exif)
    if (coords) {
      const placeName = await reverseGeocode(coords.lat, coords.lng)
      if (placeName) location = { ...coords, placeName, source: 'AUTO' }
    }
  }

  return { previewUrl: source, blob, location }
}

export async function pickPhotoFromGallery(): Promise<PickedPhoto> {
  const { results } = await Camera.chooseFromGallery({ quality: 90, includeMetadata: true })
  const result = results[0]
  if (!result) throw new Error('선택된 사진이 없습니다')
  return resolvePickedMedia(result)
}

export async function takePostPhoto(): Promise<PickedPhoto> {
  const result = await Camera.takePhoto({ quality: 90, includeMetadata: true })
  return resolvePickedMedia(result)
}
