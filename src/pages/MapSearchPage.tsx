import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SearchSuggestionItem } from '../shared/components/SearchSuggestionItem'
import { useImeAwareInput } from '../shared/hooks/useImeAwareInput'
import { useMapSearchAutocomplete } from '../features/map/hooks/useMapSearchAutocomplete'
import { useSearchMapPosts } from '../features/map/hooks/useSearchMapPosts'

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
  const { data: candidates } = useMapSearchAutocomplete(committedValue)
  const [submittedKeyword, setSubmittedKeyword] = useState<string | null>(null)
  const { data: results, isLoading, isError } = useSearchMapPosts(submittedKeyword)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = committedValue.trim()
    if (trimmed) setSubmittedKeyword(trimmed)
  }

  const handleChangeInput: typeof onChange = (e) => {
    setSubmittedKeyword(null)
    onChange(e)
  }

  const items = results?.content ?? []

  return (
    <div className="flex flex-1 flex-col">
      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label={t('searchPage.back')}
          className="flex h-9 w-9 shrink-0 items-center justify-center"
        >
          <BackIcon />
        </button>
        <div className="relative flex-1">
          <input
            value={keyword}
            onChange={handleChangeInput}
            onCompositionStart={onCompositionStart}
            onCompositionEnd={onCompositionEnd}
            placeholder={t('searchPage.placeholder')}
            autoFocus
            className="h-11 w-full rounded-full bg-gray-50 px-4 text-14 text-gray-900 outline-none placeholder:text-gray-400"
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

      {submittedKeyword === null && candidates && candidates.length > 0 && (
        <div className="flex flex-col">
          {candidates.map((candidate) => (
            <SearchSuggestionItem
              key={candidate.contentId}
              keyword={candidate.title}
              query={committedValue}
              onClick={() => setSubmittedKeyword(candidate.title)}
            />
          ))}
        </div>
      )}

      {submittedKeyword !== null && (
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {isLoading && <p className="py-8 text-center text-14 text-gray-400">{t('searchPage.loading')}</p>}
          {isError && <p className="py-8 text-center text-14 text-gray-400">{t('searchPage.error')}</p>}
          {!isLoading && !isError && items.length === 0 && (
            <p className="py-8 text-center text-14 text-gray-400">{t('searchPage.empty')}</p>
          )}
          <div className="grid grid-cols-3 gap-2">
            {items.map((item) => (
              <img
                key={item.postId}
                src={item.imageUrl}
                alt=""
                className="aspect-square w-full rounded-lg object-cover"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
