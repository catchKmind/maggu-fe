export interface PhotoSpot {
  id: string
  lng: number
  lat: number
  photos: string[]
  name: string
  category?: string
  // bbox 목록 API엔 없고, 상세 조회(useMapSpot) 이후에 채워짐
  address?: string
  hours?: string
  phone?: string
  tourismContentId: string | null
  isOngoingEvent?: boolean
}
