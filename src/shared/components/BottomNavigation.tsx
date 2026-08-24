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
    <nav className="inline-flex h-[58px] items-center gap-1 rounded-[28px] bg-gray-50 p-1">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            [
              'flex h-full items-center justify-center rounded-full px-5 text-16 text-purple-500 transition-colors',
              isActive ? 'bg-purple-50 font-semibold' : 'font-medium',
            ].join(' ')
          }
        >
          {t(item.labelKey)}
        </NavLink>
      ))}
    </nav>
  )
}
