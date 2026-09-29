import { useTranslation } from 'react-i18next'

function SortIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M3 5h12M5.5 9h7M8 13h2" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

interface SortButtonProps {
  onClick: () => void
}

export function SortButton({ onClick }: SortButtonProps) {
  const { t } = useTranslation('community')

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t('sort.label')}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-50"
    >
      <SortIcon />
    </button>
  )
}
