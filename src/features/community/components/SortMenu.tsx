import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { CommunitySortOrder } from '../types'

const SORT_OPTIONS: { key: CommunitySortOrder; labelKey: string }[] = [
  { key: 'latest', labelKey: 'sort.latest' },
  { key: 'scrap', labelKey: 'sort.scrap' },
]

function SortIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M3 5h12M5.5 9h7M8 13h2" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2.5 6.2 5 8.7 9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

interface SortMenuProps {
  value: CommunitySortOrder
  onChange: (value: CommunitySortOrder) => void
}

export function SortMenu({ value, onChange }: SortMenuProps) {
  const { t } = useTranslation('community')
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={t('sort.label')}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-50"
      >
        <SortIcon />
      </button>
      {isOpen && (
        <div className="absolute top-11 right-0 z-10 w-28 overflow-hidden rounded-2xl bg-white py-1 shadow-[0_4px_20px_rgba(0,0,0,0.12)]">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => {
                onChange(option.key)
                setIsOpen(false)
              }}
              className={`flex w-full items-center gap-1.5 px-3 py-2.5 text-left text-14 ${
                value === option.key ? 'font-semibold text-gray-900' : 'text-gray-500'
              }`}
            >
              <span className="flex w-3 shrink-0 text-purple-500">{value === option.key && <CheckIcon />}</span>
              {t(option.labelKey)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
