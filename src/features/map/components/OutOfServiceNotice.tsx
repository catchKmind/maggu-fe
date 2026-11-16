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
      className="flex w-full items-center gap-[3px] rounded-xl border border-gray-50 bg-gray-800/50 px-[14px] py-3 typo-body-m text-gray-50 backdrop-blur-[20px]"
    >
      <WarningIcon />
      <span>{t('outOfService')}</span>
    </div>
  )
}
