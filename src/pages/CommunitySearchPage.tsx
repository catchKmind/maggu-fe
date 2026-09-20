import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SearchSuggestionItem } from '../shared/components/SearchSuggestionItem'
import { useImeAwareInput } from '../shared/hooks/useImeAwareInput'
import { useSearchAutocomplete } from '../features/community/hooks/useSearchAutocomplete'
import { useSearchPosts } from '../features/community/hooks/useSearchPosts'
import { toCommunityPost } from '../features/community/mappers/toCommunityPost'
import { PostCard } from '../features/community/components/PostCard'
import { SortMenu } from '../features/community/components/SortMenu'
import type { CommunitySortOrder } from '../features/community/types'

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
  const { value: keyword, committedValue, setValue, onChange, onCompositionStart, onCompositionEnd } =
    useImeAwareInput()
  const { data: suggestions } = useSearchAutocomplete(committedValue)
  const [submittedKeyword, setSubmittedKeyword] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<CommunitySortOrder>('latest')
  const { data: results, isLoading, isError } = useSearchPosts(submittedKeyword, sortOrder)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = committedValue.trim()
    if (trimmed) setSubmittedKeyword(trimmed)
  }

  const handleChangeInput: typeof onChange = (e) => {
    setSubmittedKeyword(null)
    onChange(e)
  }

  const posts = results?.content.map(toCommunityPost) ?? []

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

      {submittedKeyword === null && suggestions && suggestions.length > 0 && (
        <div className="flex flex-col">
          {suggestions.map((suggestion) => (
            <SearchSuggestionItem
              key={suggestion}
              keyword={suggestion}
              query={committedValue}
              onClick={() => setSubmittedKeyword(suggestion)}
            />
          ))}
        </div>
      )}

      {submittedKeyword !== null && (
        <>
          <div className="px-4 pb-2">
            <SortMenu value={sortOrder} onChange={setSortOrder} />
          </div>
          <div className="flex-1 overflow-y-auto pb-8">
            {isLoading && <p className="px-5 py-8 text-center text-14 text-gray-400">{t('feed.loading')}</p>}
            {isError && <p className="px-5 py-8 text-center text-14 text-gray-400">{t('feed.error')}</p>}
            {!isLoading && !isError && posts.length === 0 && (
              <p className="px-5 py-8 text-center text-14 text-gray-400">{t('feed.empty')}</p>
            )}
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
