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
  /** 같은 장소에 연결된 게시글 수. 사진 마커 크기를 정하는 데 사용 */
  postCount?: number
}
