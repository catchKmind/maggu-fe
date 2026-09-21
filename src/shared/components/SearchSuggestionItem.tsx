function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="shrink-0">
      <circle cx="8" cy="8" r="5" stroke="#A3A3A3" strokeWidth="1.5" />
      <path d="m15 15-3.2-3.2" stroke="#A3A3A3" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
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
    <button type="button" onClick={onClick} className="flex w-full items-center gap-3 px-5 py-3 text-left">
      <SearchIcon />
      {/* min-w-0이 있어야 flex 안에서 truncate(...)가 동작함 */}
      <span className="min-w-0 flex-1 truncate text-16 text-gray-400">
        <HighlightedText text={keyword} query={query} />
      </span>
    </button>
  )
}
