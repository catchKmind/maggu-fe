import { useTranslation } from 'react-i18next'

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="5" stroke="#374151" strokeWidth="1.5" />
      <path d="m15 15-3.2-3.2" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

interface SearchIconButtonProps {
  onClick?: () => void
}

export function SearchIconButton({ onClick }: SearchIconButtonProps) {
  const { t } = useTranslation('community')

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t('search')}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-50"
    >
      <SearchIcon />
    </button>
  )
}
