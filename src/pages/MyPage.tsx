import { useTranslation } from 'react-i18next'
import { BottomNavigation } from '../shared/components/BottomNavigation'
import { Avatar } from '../shared/components/Avatar'
import { useMyAccount } from '../features/mypage/hooks/useMyAccount'

export default function MyPage() {
  const { t } = useTranslation()
  const { data, isLoading, isError } = useMyAccount()

  return (
    <div className="relative flex flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5">
        {isLoading && <p className="text-14 text-gray-400">{t('myPage.loading')}</p>}
        {isError && <p className="text-14 text-gray-400">{t('myPage.error')}</p>}
        {data && (
          <>
            <Avatar name={data.nickname} size={64} />
            <p className="text-18 font-semibold text-gray-900">{data.nickname}</p>
            <p className="text-14 text-gray-400">{data.email}</p>
          </>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-[35px] flex justify-center">
        <BottomNavigation />
      </div>
    </div>
  )
}
