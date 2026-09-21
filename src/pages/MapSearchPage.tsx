import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SearchSuggestionItem } from '../shared/components/SearchSuggestionItem'
import { useImeAwareInput } from '../shared/hooks/useImeAwareInput'
import { useMapSearchAutocomplete } from '../features/map/hooks/useMapSearchAutocomplete'
import { useSearchMapSpots } from '../features/map/hooks/useSearchMapSpots'
import { useSearchMapPosts } from '../features/map/hooks/useSearchMapPosts'
import type { FeedSort } from '../features/map/api/mapSearch.types'

type SearchTab = 'place' | 'popular' | 'recent'

const TABS: { key: SearchTab; labelKey: string }[] = [
  { key: 'place', labelKey: 'searchPage.tabs.place' },
  { key: 'popular', labelKey: 'searchPage.tabs.popular' },
  { key: 'recent', labelKey: 'searchPage.tabs.recent' },
]

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="7.2" cy="7.2" r="4.7" stroke="#A3A3A3" strokeWidth="1.5" />
      <path d="M10.8 10.8 14 14" stroke="#A3A3A3" strokeWidth="1.5" strokeLinecap="round" />
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

  const activeTabIndex = TABS.findIndex((tab) => tab.key === activeTab)
  const posts = postFeed?.content ?? []
  const isError = activeTab === 'place' ? isPlaceError : isPostError

  return (
    <div className="flex flex-1 flex-col">
      <form onSubmit={handleSubmit} className="px-4 py-3">
        <div className="relative">
          <span className="absolute top-1/2 left-4 -translate-y-1/2">
            <SearchIcon />
          </span>
          <input
            value={keyword}
            onChange={handleChangeInput}
            onCompositionStart={onCompositionStart}
            onCompositionEnd={onCompositionEnd}
            placeholder={t('searchPage.placeholder')}
            autoFocus
            className="h-11 w-full rounded-xl bg-gray-50 pr-10 pl-10 text-14 text-gray-900 outline-none placeholder:text-gray-400"
          />
          {keyword && (
            <button
              type="button"
              onClick={() => {
                setValue('')
                setSubmittedKeyword(null)
              }}
              aria-label={t('searchPage.clear')}
              className="absolute top-1/2 right-3 flex h-5 w-5 -translate-y-1/2 items-center justify-center"
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
          <div className="relative flex border-b border-gray-100">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-3 text-center text-14 transition-colors ${
                  activeTab === tab.key ? 'font-semibold text-gray-900' : 'font-medium text-gray-400'
                }`}
              >
                {t(tab.labelKey)}
              </button>
            ))}
            <span
              className="absolute bottom-0 h-0.5 bg-gray-900 transition-all duration-300 ease-out"
              style={{
                left: `calc(${activeTabIndex} * ${100 / TABS.length}% + 1rem)`,
                width: `calc(${100 / TABS.length}% - 2rem)`,
              }}
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {isError && <p className="px-5 py-8 text-center text-14 text-gray-400">{t('searchPage.error')}</p>}

            {!isError && activeTab === 'place' && (
              <div className="flex flex-col">
                {places?.length === 0 && (
                  <p className="px-5 py-8 text-center text-14 text-gray-400">{t('searchPage.empty')}</p>
                )}
                {places?.map((place) => (
                  <button
                    key={place.contentId}
                    type="button"
                    onClick={() => navigate(`/?spot=${encodeURIComponent(place.title)}`)}
                    className="flex flex-col items-start gap-1 px-5 py-3 text-left"
                  >
                    <span className="text-15 font-medium text-gray-900">{place.title}</span>
                    {place.addr && <span className="text-13 text-gray-400">{place.addr}</span>}
                  </button>
                ))}
              </div>
            )}

            {!isError && activeTab !== 'place' && (
              <div className="grid grid-cols-2 gap-1 p-1">
                {posts.map((post) => (
                  <img key={post.postId} src={post.imageUrl} alt="" className="aspect-square w-full object-cover" />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
