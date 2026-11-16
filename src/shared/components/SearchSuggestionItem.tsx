function SearchIcon() {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded border border-gray-50">
      <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="5" stroke="var(--color-icon-default)" strokeWidth="1.5" />
        <path d="m15 15-3.2-3.2" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </span>
  )
}

function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>

  const index = text.toLowerCase().indexOf(query.toLowerCase())
  if (index === -1) return <>{text}</>

  const before = text.slice(0, index)
  const match = text.slice(index, index + query.length)
  const after = text.slice(index + query.length)

  return (
    <>
      {before}
      <span className="text-gray-900">{match}</span>
      {after}
    </>
  )
}

interface SearchSuggestionItemProps {
  keyword: string
  query: string
  onClick?: () => void
}

export function SearchSuggestionItem({ keyword, query, onClick }: SearchSuggestionItemProps) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-4 px-4 py-3 text-left">
      <SearchIcon />
      {/* min-w-0이 있어야 flex 안에서 truncate(...)가 동작함 */}
      <span className="min-w-0 flex-1 truncate typo-body-m text-gray-400">
        <HighlightedText text={keyword} query={query} />
      </span>
    </button>
  )
}
