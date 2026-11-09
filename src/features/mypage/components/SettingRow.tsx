import chevronIcon from '../../../assets/mypage/icon_chevron_left.svg'

interface SettingRowProps {
  label: string
  /** 오른쪽에 회색으로 표시할 값 (예: 연동된 계정 이메일). 값이 있으면 화살표 대신 값을 보여준다 */
  value?: string
  onClick?: () => void
}

/** 마이페이지 설정 리스트 행 (Figma: mypage/setting row) */
export function SettingRow({ label, value, onClick }: SettingRowProps) {
  const className = 'flex w-full items-center justify-between rounded-[14px] bg-gray-50 px-4 pt-[14px] pb-[13px] text-left'
  const content = (
    <>
      <span className="text-14 leading-[20px] tracking-[-0.28px] text-gray-800">{label}</span>
      {value !== undefined ? (
        <span className="text-14 leading-[19px] tracking-[-0.48px] text-gray-400">{value}</span>
      ) : (
        <img src={chevronIcon} alt="" className="size-5 rotate-180" />
      )}
    </>
  )

  if (!onClick) return <div className={className}>{content}</div>

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  )
}
