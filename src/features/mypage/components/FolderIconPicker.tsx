import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MyPageHeader } from './MyPageHeader'
import { SegmentTab, SegmentTabs } from './SegmentTab'
import { BottomActionButton } from './BottomActionButton'
import { FolderIcon } from './FolderIcon'
import { FOLDER_ICON_OPTIONS, isImageIcon } from '../../myplaces/folderIcons'
import { useMyStickers } from '../../sticker/hooks/useMyStickers'

type IconTab = 'basic' | 'sticker'

interface FolderIconPickerProps {
  initialIcon: string
  onBack: () => void
  onSelect: (icon: string) => void
}

/** 리스트 아이콘 선택 (Figma: 마이페이지- 내 리스트 - 아이콘 선택). 기본 이모지 / 내 스티커 중에서 고른다. */
export function FolderIconPicker({ initialIcon, onBack, onSelect }: FolderIconPickerProps) {
  const { t } = useTranslation()
  const [tab, setTab] = useState<IconTab>(isImageIcon(initialIcon) ? 'sticker' : 'basic')
  const [selected, setSelected] = useState(initialIcon)
  const { data: stickers = [] } = useMyStickers(tab === 'sticker')

  const icons = tab === 'basic' ? FOLDER_ICON_OPTIONS : stickers.map((sticker) => sticker.imageUrl)

  return (
    <div className="flex flex-1 flex-col pt-[var(--safe-top,0px)] pb-32">
      <MyPageHeader title={t('myPage.selectIcon')} onBack={onBack} />
      <SegmentTabs>
        <SegmentTab label={t('myPage.iconTabBasic')} isActive={tab === 'basic'} onClick={() => setTab('basic')} />
        <SegmentTab label={t('myPage.myStickers')} isActive={tab === 'sticker'} onClick={() => setTab('sticker')} />
      </SegmentTabs>

      <div className="grid grid-cols-6 gap-y-2 px-4 pt-4">
        {icons.map((icon) => (
          <button
            key={icon}
            type="button"
            onClick={() => setSelected(icon)}
            className={`flex aspect-square items-center justify-center rounded-lg border ${
              selected === icon ? 'border-gray-700 bg-gray-100' : 'border-transparent'
            }`}
          >
            <FolderIcon icon={icon} size={tab === 'basic' ? 20 : 32} />
          </button>
        ))}
      </div>

      <BottomActionButton label={t('myPage.select')} onClick={() => onSelect(selected)} />
    </div>
  )
}
