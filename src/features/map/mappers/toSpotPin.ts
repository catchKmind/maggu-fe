import type { MapSpotFeature } from '../api/mapSpots.types'
import type { PhotoSpot } from '../types'

export function toSpotPin(feature: MapSpotFeature, categoryLabel: string): PhotoSpot {
  const [lng, lat] = feature.geometry.coordinates
  const { contentId, title, isOngoingEvent } = feature.properties

  return {
    id: contentId,
    lng,
    lat,
    name: title,
    photos: [],
    category: categoryLabel,
    tourismContentId: contentId,
    isOngoingEvent,
  }
}
