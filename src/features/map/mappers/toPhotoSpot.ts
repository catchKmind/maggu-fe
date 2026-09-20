import type { MapMarkerFeature } from '../api/mapMarkers.types'
import type { PhotoSpot } from '../types'

export function toPhotoSpot(feature: MapMarkerFeature): PhotoSpot {
  const [lng, lat] = feature.geometry.coordinates
  const { postId, placeName, representativeImageUrl, tourismContentId } = feature.properties

  return {
    id: String(postId),
    lng,
    lat,
    name: placeName,
    photos: [representativeImageUrl],
    tourismContentId,
  }
}
