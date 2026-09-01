import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SearchSuggestionItem } from '../features/community/components/SearchSuggestionItem'
import { useSearchAutocomplete } from '../features/community/hooks/useSearchAutocomplete'

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

export default function CommunitySearchPage() {
  const { t } = useTranslation('community')
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const { data: suggestions } = useSearchAutocomplete(keyword)

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center gap-2 px-4 py-3">
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
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={t('searchPage.placeholder')}
            autoFocus
            className="h-11 w-full rounded-full bg-gray-50 px-4 text-14 text-gray-900 outline-none placeholder:text-gray-400"
          />
          {keyword && (
            <button
              type="button"
              onClick={() => setKeyword('')}
              aria-label={t('searchPage.clear')}
              className="absolute top-1/2 right-3 flex h-5 w-5 -translate-y-1/2 items-center justify-center"
            >
              <ClearIcon />
            </button>
          )}
        </div>
      </div>

      {suggestions && suggestions.length > 0 && (
        <div className="flex flex-col">
          {suggestions.map((suggestion) => (
            <SearchSuggestionItem
              key={suggestion}
              keyword={suggestion}
              query={keyword}
              onClick={() => setKeyword(suggestion)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
