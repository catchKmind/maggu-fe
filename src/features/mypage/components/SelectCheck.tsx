import checkIcon from '../../../assets/mypage/icon_check.svg'

/** 편집 모드 선택 체크 (Figma: check - on / check - off) */
export function SelectCheck({ checked }: { checked: boolean }) {
  if (!checked) {
    return <span className="block size-6 shrink-0 rounded-xl border-[1.5px] border-gray-300 bg-white" />
  }
  return (
    <span className="relative block size-6 shrink-0 rounded-xl border-[1.5px] border-white bg-gray-700">
      <img src={checkIcon} alt="" className="absolute top-[3.5px] left-[3.5px] size-[14px]" />
    </span>
  )
}
