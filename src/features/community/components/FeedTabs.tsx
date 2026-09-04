import { useTranslation } from 'react-i18next'
import type { CommunityFeedTab } from '../types'

const TABS: { key: CommunityFeedTab; labelKey: string }[] = [
  { key: 'recommended', labelKey: 'tabs.recommended' },
  { key: 'question', labelKey: 'tabs.question' },
]

interface FeedTabsProps {
  activeTab: CommunityFeedTab
  onChange: (tab: CommunityFeedTab) => void
}

export function FeedTabs({ activeTab, onChange }: FeedTabsProps) {
  const { t } = useTranslation('community')

  return (
    <div className="flex items-center gap-2">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`shrink-0 rounded-full px-4 py-2 text-14 transition-colors ${
            activeTab === tab.key
              ? 'border border-purple-500 font-semibold text-purple-500'
              : 'border border-transparent font-medium text-gray-500'
          }`}
        >
          {t(tab.labelKey)}
        </button>
      ))}
    </div>
  )
}
