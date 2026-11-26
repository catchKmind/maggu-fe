import { preload, removeBackground, type Config, type ImageSource } from '@imgly/background-removal'
import { createStickerBorder } from './createStickerBorder'
import { resizeImage } from './resizeImage'

export interface CreateStickerOptions {
  borderWidth?: number
  borderColor?: string
}

/** 누끼를 따기 전에 사진을 이 크기(긴 변, px)까지 줄인다 */
const REMOVE_INPUT_MAX_SIDE = 1024
/** 스티커 결과의 크기(긴 변, px). 화면에는 80px 안팎으로 보여서 이 정도면 충분하다 */
const STICKER_MAX_SIDE = 768

/**
 * 누끼 설정(빠른 쪽). device 'gpu'는 기기가 WebGPU를 지원하면 GPU로 계산하고, 지원하지 않으면 라이브러리가 알아서 CPU로 돌린다.
 * proxyToWorker는 라이브러리가 GPU를 쓸 때만 적용되는데, 계산을 화면과 별도 스레드(웹 워커)에서 돌려서
 * 처리하는 동안 화면이 멈추지 않게 한다. (기본값은 CPU + 화면 스레드라서 앱이 얼어붙었다)
 */
const FAST_CONFIG: Config = { device: 'gpu', proxyToWorker: true }
/** GPU 쪽이 실패했을 때 되돌아갈 기본 설정 */
const SAFE_CONFIG: Config = { device: 'cpu' }

/** GPU(WebGPU)로 먼저 시도하고, 실패하면 CPU로 한 번 더 시도한다 */
async function removeBackgroundWithFallback(input: ImageSource): Promise<Blob> {
  try {
    return await removeBackground(input, FAST_CONFIG)
  } catch {
    return removeBackground(input, SAFE_CONFIG)
  }
}

/**
 * 스티커 만들기 화면에 들어올 때 불러 두면, 사용자가 "길게 눌러 배경 지우기"를 하기 전에
 * 누끼 모델(수십 MB)을 미리 내려받아 첫 스티커가 덜 기다린다. 실패해도 무시한다(실제 처리 때 다시 시도).
 */
export function preloadStickerModel() {
  void preload(FAST_CONFIG).catch(() => {})
}

/**
 * 사진에서 배경을 지우고(누끼) 다이컷 스티커 테두리를 입힌 PNG(Blob)를 만든다.
 * 배경 제거는 전부 브라우저 안에서 처리됨(@imgly/background-removal, 서버 전송 없음).
 * 첫 실행 시 세그멘테이션 모델(수십 MB)을 내려받아 캐시하므로 몇 초 걸릴 수 있음.
 *
 * 속도: 사진을 먼저 줄이고(1024px) → 누끼(WebGPU 지원 기기는 GPU + 별도 스레드) → 결과를 768px로 줄여서 → 테두리를 그린다.
 */
export async function createSticker(source: ImageSource, options: CreateStickerOptions = {}): Promise<Blob> {
  const input =
    typeof source === 'string' || source instanceof Blob
      ? await resizeImage(source, REMOVE_INPUT_MAX_SIDE, 'image/jpeg')
      : source
  const cutout = await removeBackgroundWithFallback(input)
  const smallCutout = await resizeImage(cutout, STICKER_MAX_SIDE, 'image/png')
  return createStickerBorder(smallCutout, options)
}
