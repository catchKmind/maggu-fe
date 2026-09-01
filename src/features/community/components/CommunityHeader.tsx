import { useTranslation } from 'react-i18next'
import { Avatar } from '../../../shared/components/Avatar'
import type { CommunityAuthor } from '../types'

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M9 3v12M3 9h12" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

interface CommunityHeaderProps {
  author: CommunityAuthor
  onCompose?: () => void
}

export function CommunityHeader({ author, onCompose }: CommunityHeaderProps) {
  const { t } = useTranslation('community')

  return (
    <div className="flex items-center justify-between px-5 py-4">
      <div className="flex items-center gap-3">
        <Avatar name={author.name} avatarUrl={author.avatarUrl} size={40} />
        <div className="flex flex-col">
          <span className="text-16 font-semibold text-gray-900">{author.name}</span>
          <span className="text-13 text-gray-400">{t('composePrompt')}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={onCompose}
        aria-label={t('write')}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
      >
        <PlusIcon />
      </button>
    </div>
  )
}
