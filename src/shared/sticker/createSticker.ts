import { removeBackground, type ImageSource } from '@imgly/background-removal'
import { createStickerBorder } from './createStickerBorder'

export interface CreateStickerOptions {
  borderWidth?: number
  borderColor?: string
}

/**
 * 사진에서 배경을 지우고(누끼) 다이컷 스티커 테두리를 입힌 PNG(Blob)를 만든다.
 * 배경 제거는 전부 브라우저 안에서 처리됨(@imgly/background-removal, 서버 전송 없음).
 * 첫 실행 시 세그멘테이션 모델(수십 MB)을 내려받아 캐시하므로 몇 초 걸릴 수 있음.
 */
export async function createSticker(source: ImageSource, options: CreateStickerOptions = {}): Promise<Blob> {
  const cutout = await removeBackground(source)
  return createStickerBorder(cutout, options)
}
