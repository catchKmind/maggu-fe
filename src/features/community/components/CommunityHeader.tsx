import { useTranslation } from 'react-i18next'
import { Avatar } from '../../../shared/components/Avatar'

function PlusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

interface CommunityHeaderProps {
  /** 로그인한 사용자의 닉네임. 아직 못 불러왔으면 비워둔다 */
  nickname?: string
  onCompose?: () => void
}

export function CommunityHeader({ nickname = '', onCompose }: CommunityHeaderProps) {
  const { t } = useTranslation('community')

  return (
    <div className="flex items-center justify-between h-[57px] px-4">
      <div className="flex items-center gap-2">
        <Avatar name={nickname} size={32} />
        <div className="flex flex-col gap-1">
          <span className="h-5 text-14 leading-[19px] font-medium tracking-[-0.48px] text-gray-900">{nickname}</span>
          <span className="h-5 text-14 leading-[19px] tracking-[-0.48px] text-gray-400">{t('composePrompt')}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={onCompose}
        aria-label={t('write')}
        className="flex h-[45px] w-[45px] shrink-0 items-center justify-center rounded-full bg-white"
      >
        <PlusIcon />
      </button>
    </div>
  )
}
