import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const NAV_ITEMS = [
  { to: '/community', labelKey: 'nav.community', end: false },
  { to: '/', labelKey: 'nav.map', end: true },
  { to: '/my-page', labelKey: 'nav.myPage', end: false },
] as const

export function BottomNavigation() {
  const { t } = useTranslation()

  return (
    <nav className="inline-flex h-[58px] items-center gap-1 rounded-[28px] bg-[#8995FC] p-1">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            [
              'flex h-full items-center justify-center rounded-full px-5 text-16 transition-colors',
              isActive
                ? 'bg-[#7A87FB] bg-[radial-gradient(50px_20px_at_15%_-90%,rgba(255,255,255,0.45),transparent_20%)] font-semibold text-white shadow-[inset_0.6px_0.6px_0px_rgba(255,255,255,0.45),inset_-1px_-1px_0px_rgba(255,255,255,0.45)] backdrop-blur-md'
                : 'font-medium text-white/70',
            ].join(' ')
          }
        >
          {t(item.labelKey)}
        </NavLink>
      ))}
    </nav>
  )
}
