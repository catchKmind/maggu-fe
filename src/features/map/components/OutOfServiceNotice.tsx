import { useTranslation } from 'react-i18next'

function WarningIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M9 2.5 16.5 15.5H1.5L9 2.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M9 7v3.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="9" cy="12.9" r="0.75" fill="currentColor" />
    </svg>
  )
}

export function OutOfServiceNotice() {
  const { t } = useTranslation('map')

  return (
    <div
      role="status"
      className="flex items-center gap-2 rounded-[20px] bg-gray-500/75 px-5 py-3 text-14 text-white backdrop-blur-sm"
    >
      <WarningIcon />
      <span>{t('outOfService')}</span>
    </div>
  )
}
