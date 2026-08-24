import type { PhotoSpot } from '../types'

const placeholderPhoto = (seed: string) => `https://picsum.photos/seed/${seed}/200/200`
const feedPhotos = (prefix: string, count: number) =>
  Array.from({ length: count }, (_, i) => placeholderPhoto(`${prefix}-feed-${i}`))

/**
 * 서버 연동 전까지 쓰는 임시 목업 데이터.
 * 동촌유원지(대구 동구 효목동) 주변 좌표에 사진 개수가 다른 스팟들을 배치해 마커 크기 차이를 확인할 수 있음.
 */
export const MOCK_PHOTO_SPOTS: PhotoSpot[] = [
  {
    id: '1',
    lng: 128.6598,
    lat: 35.888,
    photos: [placeholderPhoto('spot-1')],
    name: '아양전망대',
    category: '전망대',
    address: '대구 동구 효목동 1298',
    hours: '운영 중 · 22:00 운영 종료',
    phone: '053 - 111 - 222',
    feedPhotos: feedPhotos('spot-1', 4),
  },
  {
    id: '2',
    lng: 128.6627,
    lat: 35.8862,
    photos: [placeholderPhoto('spot-2a'), placeholderPhoto('spot-2b'), placeholderPhoto('spot-2c')],
    name: '금호강 자전거길',
    category: '관광명소',
    address: '대구 동구 효목동 1305',
    hours: '24시간 운영',
    phone: '053 - 333 - 444',
    feedPhotos: feedPhotos('spot-2', 5),
  },
  {
    id: '3',
    lng: 128.6613,
    lat: 35.884,
    photos: [
      placeholderPhoto('spot-3a'),
      placeholderPhoto('spot-3b'),
      placeholderPhoto('spot-3c'),
      placeholderPhoto('spot-3d'),
      placeholderPhoto('spot-3e'),
    ],
    name: '동촌유원지',
    category: '공원',
    address: '대구 동구 효목동 1314',
    hours: '운영 중 · 18:00 운영 종료',
    phone: '053 - 999 - 999',
    feedPhotos: feedPhotos('spot-3', 6),
  },
  {
    id: '4',
    lng: 128.6636,
    lat: 35.8835,
    photos: [placeholderPhoto('spot-4')],
    name: '아양루',
    category: '맛집',
    address: '대구 동구 효목동 1321',
    hours: '운영 중 · 21:00 운영 종료',
    phone: '053 - 555 - 666',
    feedPhotos: feedPhotos('spot-4', 4),
  },
]
