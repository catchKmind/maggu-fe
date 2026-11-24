import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SearchSuggestionItem } from '../shared/components/SearchSuggestionItem'
import { useImeAwareInput } from '../shared/hooks/useImeAwareInput'
import { useMapSearchAutocomplete } from '../features/map/hooks/useMapSearchAutocomplete'
import { useSearchMapSpots } from '../features/map/hooks/useSearchMapSpots'
import { useSearchMapPosts } from '../features/map/hooks/useSearchMapPosts'
import { PlaceDetailSheet } from '../features/map/components/PlaceDetailSheet'
import { PlaceResultItem } from '../features/map/components/PlaceResultItem'
import type { FeedSort } from '../features/map/api/mapSearch.types'
import type { MapSpotDetail } from '../features/map/api/mapSpots.types'
import type { PhotoSpot } from '../features/map/types'

type SearchTab = 'place' | 'popular' | 'recent'

const TABS: { key: SearchTab; labelKey: string }[] = [
  { key: 'place', labelKey: 'searchPage.tabs.place' },
  { key: 'popular', labelKey: 'searchPage.tabs.popular' },
  { key: 'recent', labelKey: 'searchPage.tabs.recent' },
]

function toPhotoSpot(place: MapSpotDetail, categoryLabel: string): PhotoSpot {
  return {
    id: place.contentId,
    lng: place.lng,
    lat: place.lat,
    name: place.title,
    photos: place.images,
    category: categoryLabel,
    address: place.addr ?? undefined,
    hours: place.businessHours ?? undefined,
    phone: place.tel ?? undefined,
    tourismContentId: place.contentId,
  }
}

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M12.5 4.5 6 11l6.5 6.5" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ClearIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 3l8 8M11 3l-8 8" stroke="#A3A3A3" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export default function MapSearchPage() {
  const { t } = useTranslation('map')
  const navigate = useNavigate()
  const { value: keyword, committedValue, setValue, onChange, onCompositionStart, onCompositionEnd } =
    useImeAwareInput()
  const [submittedKeyword, setSubmittedKeyword] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<SearchTab>('place')
  const [selectedSpot, setSelectedSpot] = useState<PhotoSpot | null>(null)

  const { data: candidates } = useMapSearchAutocomplete(committedValue)
  const { data: places, isError: isPlaceError } = useSearchMapSpots(
    activeTab === 'place' ? submittedKeyword : null,
  )
  const feedSort: FeedSort = activeTab === 'popular' ? 'POPULAR' : 'LATEST'
  const { data: postFeed, isError: isPostError } = useSearchMapPosts(
    activeTab === 'place' ? null : submittedKeyword,
    feedSort,
  )

  const submit = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return
    setValue(trimmed)
    setSubmittedKeyword(trimmed)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submit(committedValue)
  }

  const handleChangeInput: typeof onChange = (e) => {
    setSubmittedKeyword(null)
    onChange(e)
  }

  const posts = postFeed?.content ?? []
  const isError = activeTab === 'place' ? isPlaceError : isPostError

  return (
    <div className="flex flex-1 flex-col pt-[calc(var(--safe-top,0px)+7px)]">
      <form onSubmit={handleSubmit} className="px-4 pb-[10px]">
        <div className="relative">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label={t('searchPage.back')}
            className="absolute top-1/2 left-2 flex size-5 -translate-y-1/2 items-center justify-center"
          >
            <BackIcon />
          </button>
          <input
            value={keyword}
            onChange={handleChangeInput}
            onCompositionStart={onCompositionStart}
            onCompositionEnd={onCompositionEnd}
            placeholder={t('searchPage.placeholder')}
            autoFocus
            className="h-9 w-full rounded-lg bg-gray-100 pr-9 pl-[37px] typo-body-m text-gray-900 outline-none placeholder:text-gray-400"
          />
          {keyword && (
            <button
              type="button"
              onClick={() => {
                setValue('')
                setSubmittedKeyword(null)
              }}
              aria-label={t('searchPage.clear')}
              className="absolute top-1/2 right-2 flex size-5 -translate-y-1/2 items-center justify-center"
            >
              <ClearIcon />
            </button>
          )}
        </div>
      </form>

      {submittedKeyword === null ? (
        <div className="flex flex-col">
          {candidates?.map((candidate) => (
            <SearchSuggestionItem
              key={candidate.contentId}
              keyword={candidate.title}
              query={committedValue}
              onClick={() => submit(candidate.title)}
            />
          ))}
        </div>
      ) : (
        <>
          <div className="flex px-4">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex h-12 flex-1 items-center justify-center border-b-2 typo-body-m transition-colors ${
                  activeTab === tab.key ? 'border-gray-800 font-medium text-gray-800' : 'border-transparent text-gray-500'
                }`}
              >
                {t(tab.labelKey)}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {isError && <p className="px-5 py-8 text-center text-14 text-gray-400">{t('searchPage.error')}</p>}

            {!isError && activeTab === 'place' && (
              <div className="flex flex-col">
                {places?.length === 0 && (
                  <p className="px-5 py-8 text-center text-14 text-gray-400">{t('searchPage.empty')}</p>
                )}
                {places?.map((place) => (
                  <PlaceResultItem
                    key={place.contentId}
                    place={place}
                    onClick={() => setSelectedSpot(toPhotoSpot(place, t(`placeDetail.contentType.${place.contentType}`)))}
                  />
                ))}
              </div>
            )}

            {!isError && activeTab !== 'place' && (
              <div className="grid grid-cols-2 gap-2 px-4 py-7">
                {posts.map((post) => (
                  // 사진을 누르면 그 게시글 상세로 이동한다
                  <button
                    key={post.postId}
                    type="button"
                    onClick={() => navigate(`/community/posts/${post.postId}`)}
                    className="block h-[197px] w-full overflow-hidden rounded-lg"
                  >
                    <img src={post.imageUrl} alt="" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
      <PlaceDetailSheet spot={selectedSpot} onClose={() => setSelectedSpot(null)} />
    </div>
  )
}
