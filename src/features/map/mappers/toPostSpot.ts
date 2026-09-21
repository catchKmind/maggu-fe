import type { MapPostFeature } from '../api/mapPosts.types'
import type { PhotoSpot } from '../types'

export function toPostSpot(feature: MapPostFeature): PhotoSpot {
  const [lng, lat] = feature.geometry.coordinates
  const { postId, placeName, representativeImageUrl, tourismContentId, placePostCount } = feature.properties

  return {
    id: String(postId),
    lng,
    lat,
    name: placeName,
    photos: [representativeImageUrl],
    tourismContentId,
    postCount: placePostCount ?? 1,
  }
}
