import { useTranslation } from 'react-i18next'
import { BottomNavigation } from '../shared/components/BottomNavigation'

export default function MyPage() {
  const { t } = useTranslation()

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center">
      <p className="text-16 text-gray-500">{t('nav.myPage')}</p>
      <div className="absolute inset-x-0 bottom-[35px] flex justify-center">
        <BottomNavigation />
      </div>
    </div>
  )
}
