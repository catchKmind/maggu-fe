import { Camera, type MediaResult } from '@capacitor/camera'
import { isNativeApp } from '../../../shared/lib/platform'
import { uploadFile } from '../../uploads/uploadFile'
import { extractExifCoordinates } from '../photoMetadata'
import { reverseGeocode } from '../../../shared/lib/reverseGeocode'
import type { PostLocation } from '../types'

export interface PickedPhotoResult {
  previewUrl: string
  objectKey: string
  /** EXIF에 GPS가 있고(네이티브 전용) 역지오코딩까지 성공했을 때만 채워짐 */
  location: PostLocation | null
}

async function resolvePickedMedia(result: MediaResult): Promise<PickedPhotoResult> {
  const source = result.webPath ?? result.uri
  if (!source) throw new Error('사진을 불러오지 못했습니다')

  const blob = await fetch(source).then((res) => res.blob())
  const objectKey = await uploadFile(blob, 'POST')

  let location: PostLocation | null = null
  // exif는 네이티브(iOS/Android)에서만 내려온다 — 웹에서는 항상 null
  if (isNativeApp()) {
    const coords = extractExifCoordinates(result.metadata?.exif)
    if (coords) {
      const placeName = await reverseGeocode(coords.lat, coords.lng)
      if (placeName) location = { ...coords, placeName, source: 'AUTO' }
    }
  }

  return { previewUrl: source, objectKey, location }
}

export async function pickPhotoFromGallery(): Promise<PickedPhotoResult> {
  const { results } = await Camera.chooseFromGallery({ quality: 90, includeMetadata: true })
  const result = results[0]
  if (!result) throw new Error('선택된 사진이 없습니다')
  return resolvePickedMedia(result)
}

export async function takePostPhoto(): Promise<PickedPhotoResult> {
  const result = await Camera.takePhoto({ quality: 90, includeMetadata: true })
  return resolvePickedMedia(result)
}
