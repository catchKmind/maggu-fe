import { useTranslation } from 'react-i18next'
import type { CommunityFeedTab } from '../types'

// 나를 위한 추천, 질문 탭
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
          className={`shrink-0 rounded-lg border px-3 py-[6px] text-14 transition-colors ${
            activeTab === tab.key
              ? 'border-purple-400 bg-purple-50 font-medium text-purple-500'
              : 'border-gray-200 bg-white font-medium text-gray-800'
          }`}
        >
          {t(tab.labelKey)}
        </button>
      ))}
    </div>
  )
}
