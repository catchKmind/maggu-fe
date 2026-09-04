export interface PhotoSpot {
  id: string
  lng: number
  lat: number
  photos: string[]
  name: string
  // 지도 마커 API(MapPostProperties)엔 없는 정보라 실데이터에선 채워지지 않음
  category?: string
  address?: string
  hours?: string
  phone?: string
  feedPhotos: string[]
}
