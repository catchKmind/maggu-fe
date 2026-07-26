import { Outlet } from 'react-router-dom'

/**
 * 공통 레이아웃. 세이프에어리어 패딩 적용 (노치/홈바 대응).
 */
export default function Layout() {
  return (
    <div
      className="flex min-h-full flex-col"
      style={{
        paddingTop: 'var(--safe-top)',
        paddingBottom: 'var(--safe-bottom)',
        paddingLeft: 'var(--safe-left)',
        paddingRight: 'var(--safe-right)',
      }}
    >
      <Outlet />
    </div>
  )
}
