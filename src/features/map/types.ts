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
  /** 같은 장소에 연결된 게시글 수. 사진 마커 크기를 정하는 데 사용 */
  postCount?: number
  /**
   * photos가 게시글 사진인지(지도 마커) 장소 사진인지(검색 결과).
   * 게시글 사진은 마커 이미지로만 쓰고, 장소 상세의 "장소 사진" 칸에는 보여주지 않는다.
   */
  isPostPhoto?: boolean
}
