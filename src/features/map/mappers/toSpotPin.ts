import type { MapSpotDetail } from '../api/mapSpots.types'
import type { PhotoSpot } from '../types'

export function toSpotPin(spot: MapSpotDetail, categoryLabel: string): PhotoSpot {
  return {
    id: spot.contentId,
    lng: spot.lng,
    lat: spot.lat,
    name: spot.title,
    photos: spot.images,
    category: categoryLabel,
    address: spot.addr ?? undefined,
    hours: spot.businessHours ?? undefined,
    phone: spot.tel ?? undefined,
    tourismContentId: spot.contentId,
    isOngoingEvent: Boolean(spot.eventPeriod),
  }
}
