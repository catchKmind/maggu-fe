import { Outlet } from 'react-router-dom'

/**
 * 공통 레이아웃. 세이프에어리어 패딩 적용 (노치/홈바 대응).
 * 데스크톱 브라우저에서도 모바일 웹뷰 비율(max-w)로 보이도록 가운데 정렬.
 */
export default function Layout() {
  return (
    <div className="flex justify-center bg-gray-200">
      <div
        className="flex min-h-dvh w-full max-w-[430px] flex-col bg-white"
        style={{
          paddingTop: 'var(--safe-top)',
          paddingBottom: 'var(--safe-bottom)',
          paddingLeft: 'var(--safe-left)',
          paddingRight: 'var(--safe-right)',
        }}
      >
        <Outlet />
      </div>
    </div>
  )
}
