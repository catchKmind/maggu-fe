import { useTranslation } from 'react-i18next'
import { useSlideSheet } from '../../../shared/hooks/useSlideSheet'
import type { CommunitySortOrder } from '../types'

const SORT_OPTIONS: { key: CommunitySortOrder; labelKey: string }[] = [
  { key: 'latest', labelKey: 'sort.latest' },
  { key: 'scrap', labelKey: 'sort.scrap' },
]

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.5 8.3 6.5 11.3 12.5 4.7" stroke="#171717" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

interface SortSheetProps {
  isOpen: boolean
  value: CommunitySortOrder
  onChange: (value: CommunitySortOrder) => void
  onClose: () => void
}

export function SortSheet({ isOpen, value, onChange, onClose }: SortSheetProps) {
  const { t } = useTranslation('community')
  const { shouldRender, isVisible } = useSlideSheet(isOpen)

  if (!shouldRender) return null

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label={t('sort.label')}
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        className={`absolute inset-x-0 bottom-0 mx-auto flex w-full max-w-[430px] flex-col rounded-t-[24px] bg-white pb-[calc(var(--safe-bottom)+16px)] transition-transform duration-300 ease-out ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="h-1 w-9 rounded-full bg-gray-200" />
        </div>

        <div className="flex flex-col gap-2 px-4 pt-2">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => {
                onChange(option.key)
                onClose()
              }}
              className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-4 text-16 text-gray-900"
            >
              {t(option.labelKey)}
              {value === option.key && <CheckIcon />}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
