import { useTranslation } from 'react-i18next'
import { BottomNavigation } from '../shared/components/BottomNavigation'
import { useMyAccount } from '../features/mypage/hooks/useMyAccount'
import { ProfileAvatar } from '../features/mypage/components/ProfileAvatar'
import { SettingRow } from '../features/mypage/components/SettingRow'
import { maskEmail } from '../features/mypage/maskEmail'
import pencilIcon from '../assets/mypage/icon_pencil.svg'

function SectionTitle({ children }: { children: string }) {
  return <p className="text-14 leading-[20px] tracking-[-0.28px] text-gray-500">{children}</p>
}

export default function MyPage() {
  const { t } = useTranslation()
  const { data: account } = useMyAccount()

  return (
    <div className="relative flex flex-1 flex-col pt-[var(--safe-top,0px)] pb-[140px]">
      <div className="flex items-center justify-between px-4 py-[18px]">
        <div className="flex items-center gap-3">
          <ProfileAvatar />
          <span className="text-16 leading-[24px] font-medium tracking-[-0.32px] text-gray-800">
            {account?.nickname}
          </span>
        </div>
        <button
          type="button"
          aria-label={t('myPage.editProfile')}
          className="flex items-center justify-center rounded-full bg-gray-50 p-2"
        >
          <img src={pencilIcon} alt="" className="size-4" />
        </button>
      </div>
      <div className="h-[1.5px] bg-gray-100" />

      <section className="flex flex-col gap-3 px-4 pt-7 pb-2">
        <SectionTitle>{t('myPage.activity')}</SectionTitle>
        <div className="flex flex-col gap-2">
          <SettingRow label={t('myPage.myPosts')} />
          <SettingRow label={t('myPage.myComments')} />
        </div>
      </section>

      <section className="flex flex-col gap-3 px-4 pt-[18px] pb-2">
        <SectionTitle>{t('myPage.storage')}</SectionTitle>
        <div className="flex flex-col gap-2">
          <SettingRow label={t('myPage.myStickers')} />
          <SettingRow label={t('myPage.myLists')} />
        </div>
      </section>

      <section className="flex flex-col gap-3 px-4 pt-[18px] pb-2">
        <SectionTitle>{t('myPage.account')}</SectionTitle>
        <SettingRow label={t('myPage.linkedAccount')} value={account ? maskEmail(account.email) : ''} />
      </section>

      <div className="flex items-center justify-center gap-3 pt-12 text-14 leading-[19px] tracking-[-0.48px] text-gray-400">
        <button type="button">{t('myPage.logout')}</button>
        <span className="h-3 w-px bg-gray-200" />
        <button type="button">{t('myPage.withdraw')}</button>
      </div>

      <div className="absolute inset-x-0 bottom-[35px] flex justify-center">
        <BottomNavigation />
      </div>
    </div>
  )
}
