import type { PhotoSpot } from '../types'

const placeholderPhoto = (seed: string) => `https://picsum.photos/seed/${seed}/200/200`

/**
 * 서버 연동 전까지 쓰는 임시 목업 데이터.
 * 동촌유원지(대구 동구 효목동) 주변 좌표에 사진 개수가 다른 스팟들을 배치해 마커 크기 차이를 확인할 수 있음.
 */
export const MOCK_PHOTO_SPOTS: PhotoSpot[] = [
  { id: '1', lng: 128.6598, lat: 35.888, photos: [placeholderPhoto('spot-1')] },
  {
    id: '2',
    lng: 128.6627, lat: 35.8862,
    photos: [placeholderPhoto('spot-2a'), placeholderPhoto('spot-2b'), placeholderPhoto('spot-2c')],
  },
  {
    id: '3',
    lng: 128.6613, lat: 35.884,
    photos: [
      placeholderPhoto('spot-3a'),
      placeholderPhoto('spot-3b'),
      placeholderPhoto('spot-3c'),
      placeholderPhoto('spot-3d'),
      placeholderPhoto('spot-3e'),
    ],
  },
  { id: '4', lng: 128.6636, lat: 35.8835, photos: [placeholderPhoto('spot-4')] },
]
