import { isImageIcon } from '../../myplaces/folderIcons'

interface FolderIconProps {
  icon: string
  /** 이모지 글자 크기 / 스티커 이미지 크기(px) */
  size: number
}

/** 리스트 아이콘. 이모지 문자열이면 글자로, 내 스티커 URL이면 이미지로 그린다. */
export function FolderIcon({ icon, size }: FolderIconProps) {
  if (isImageIcon(icon)) {
    return <img src={icon} alt="" className="object-contain" style={{ width: size, height: size }} />
  }
  return (
    <span className="leading-none" style={{ fontSize: size }}>
      {icon}
    </span>
  )
}
