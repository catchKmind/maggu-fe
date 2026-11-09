import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import arrowLeftIcon from '../../../assets/mypage/icon_arrow_left.svg'

interface MyPageHeaderProps {
  title: string
  /** 오른쪽 텍스트 버튼 (예: 저장 / 편집 / 완료) */
  action?: ReactNode
  onBack?: () => void
}

/** 마이페이지 하위 화면 공통 헤더 (Figma: page header) - 뒤로가기 + 제목 + 오른쪽 텍스트 버튼 */
export function MyPageHeader({ title, action, onBack }: MyPageHeaderProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="flex items-center justify-between border-b border-[#eee] py-3 pr-5 pl-4">
      <button
        type="button"
        onClick={onBack ?? (() => navigate(-1))}
        aria-label={t('stickerCreate.back')}
        className="flex items-center gap-1 py-1"
      >
        <img src={arrowLeftIcon} alt="" className="size-6" />
        <span className="text-16 leading-[24px] font-semibold tracking-[-0.1px] text-gray-700">{title}</span>
      </button>
      {action}
    </div>
  )
}

interface HeaderTextButtonProps {
  children: string
  onClick: () => void
  disabled?: boolean
}

export function HeaderTextButton({ children, onClick, disabled }: HeaderTextButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="text-16 leading-[24px] font-semibold tracking-[-0.1px] text-gray-700 disabled:text-gray-400"
    >
      {children}
    </button>
  )
}
